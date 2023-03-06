import { AppointmentBookingEntity, AppointmentBookingStatus } from 'src/entities/AppointmentBooking.entity';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException, } from '@nestjs/common';
import { BillingEntity } from 'src/entities/Billing.entity';
import { CompanyEntity } from 'src/entities/Company.entity';
import { PaymentEntity } from 'src/entities/Payment.entity';
import { SiteSettingEntity } from 'src/entities/SiteSetting.entity';
import { StripesService } from '../stripes/stripes.service';
import { AddNewCardDto } from './dto/AddNewCard.dto';
import { ChargePaymentDto } from './dto/ChargePayment.dto';
import { PaymentGateway } from './payment.gateway';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { BillingDetailEntity } from 'src/entities/BillingDetailt.entity';

@Injectable()
export class PaymentService {
  constructor(
    private stripesService: StripesService,
    @Inject(forwardRef(() => PaymentGateway))
    private paymentGateway: PaymentGateway,
  ) { }

  async payment(storeId: number, data: CreatePaymentDto) {
    PaymentEntity.save(<PaymentEntity>{
      payment_method: data.payment_method,
      status: "succeeded",
      amount: data.amount,
      stripeId: null,
      billingId: data.billId
    })

    await BillingEntity.createQueryBuilder().update({ isPaid: true }).where("id = :id", { id: data.billId }).execute()

    let billDetail = await BillingDetailEntity.createQueryBuilder('buildDetail')
      .select(["buildDetail.bookingId", "buildDetail.id"])
      .where("buildDetail.billingId = :billingId", { billingId: data.billId }).getOne();

    AppointmentBookingEntity.createQueryBuilder().update({ status: AppointmentBookingStatus.completed }).where("id = :id", { id: billDetail.bookingId }).execute();

    return BillingEntity.createQueryBuilder("bill")
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

  async addNewCard(body: AddNewCardDto, companyId: number) {
    const company = await CompanyEntity.findOneBy({ id: companyId });
    const paymentGateway = await this.checkPaymentGateway();
    const { token, autoPay } = body;
    if (paymentGateway.value === 'stripe') {
      if (!company.stripeCustomerId) {
        const stripeCustomer = await this.stripesService.createCustomer(companyId,);
        company.stripeCustomerId = stripeCustomer.id;
        await company.save();
      }
      const card = await this.stripesService.addCardToCustomer(companyId, token,);
      if (autoPay) {
        await this.stripesService.updateDefaultCard(companyId, card.id);
      }
      return card;
    } else {
      throw new NotFoundException('No payment gateway installed');
    }
  };

  listCard = async (companyId: number) => {
    const paymentGateway = await this.checkPaymentGateway();

    if (paymentGateway.value === 'stripe') {
      return await this.stripesService.listCards(companyId);
    } else {
      throw new NotFoundException('No payment gateway installed');
    }
  };

  async listBankAccount(companyId: number) {
    const paymentGateway = await this.checkPaymentGateway();
    if (paymentGateway.value === 'stripe') {
      return await this.stripesService.listBankAccount(companyId);
    } else {
      throw new NotFoundException('No payment gateway installed');
    }
  };


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
