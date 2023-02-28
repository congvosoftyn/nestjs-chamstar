import { forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException, } from '@nestjs/common';
import { BillingEntity } from 'src/entities/Billing.entity';
import { CompanyEntity } from 'src/entities/Company.entity';
import { PaymentEntity } from 'src/entities/Payment.entity';
import { SiteSettingEntity } from 'src/entities/SiteSetting.entity';
import { AddNewCardDto } from './dto/AddNewCard.dto';
import { ChargePaymentDto } from './dto/ChargePayment.dto';
import { PaymentGateway } from './payment.gateway';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(forwardRef(() => PaymentGateway))
    private paymentGateway: PaymentGateway,
  ) { }

  async payment(storeId: number, data: CreatePaymentDto) {
    let payment = await PaymentEntity.save(<PaymentEntity>{
      payment_method: data.payment_method,
      status: "succeeded",
      amount: data.amount,
      stripeId: null,
    })
    if (payment) {
      await BillingEntity.createQueryBuilder().update({ isPaid: true }).where("id = :id", { id: data.billId }).execute()
    }

    return await BillingEntity.createQueryBuilder("bill")
      .leftJoinAndSelect("bill.billingDetails", "billingDetails")
      .where("bill.id = :id and bill.storeId = :storeId ", { id: data.billId, storeId: storeId })
      .getOne()
  }

  async findPayment(pageNumber: number, pageSize: number, companyId: number) {
    const rootQuery = await PaymentEntity.createQueryBuilder('payment')
      .leftJoin('payment.billing', 'billing')
      .leftJoin('billing.subscription', 'sub')
      .where('sub.companyId = :companyId', { companyId });

    const payments = await rootQuery
      .skip(pageNumber ? +pageNumber : 0)
      .take(pageSize ? +pageSize : 10)
      .orderBy('payment.created', 'DESC')
      .getMany();

    const total = await rootQuery.getCount();
    return { items: payments, totalCount: total };
  }


  private async checkPaymentGateway() {
    let paymentGateway = await SiteSettingEntity.findOne({ where: { key: 'paymentGateway' }, });
    if (!paymentGateway) {
      paymentGateway = new SiteSettingEntity();
      paymentGateway.key = 'paymentGateway';
      paymentGateway.value = 'stripe';
      await paymentGateway.save();
    }
    return paymentGateway;
  }

  getPayments(skip: number = 0, take: number = 10, companyId: number) {
    return PaymentEntity.createQueryBuilder('payment')
      .leftJoin('payment.billing', 'billing')
      .leftJoin('billing.subscription', 'sub')
      .where('sub.companyId = :companyId', { companyId })
      .take(take)
      .skip(skip)
      .orderBy('payment.created', 'DESC')
      .getMany();
  }
}
