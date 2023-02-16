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

@Injectable()
export class PaymentService {
  constructor(
    private stripesService: StripesService,
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

  // async chargePayment(body: ChargePaymentDto, companyId: number, userId: number,) {
  //   const { amount, billId, card, token } = body;
  //   const paymentGateway = await this.checkPaymentGateway();

  //   if (paymentGateway.value === 'stripe') {
  //     const charge = token ? await this.stripesService.createACharge(token, amount, companyId, userId,) : await this.stripesService.createACustomerCharge(card, amount, companyId, userId,);
  //     if (charge) {
  //       if (charge.status !== 'succeeded') throw new HttpException('Payment is not succeeded', HttpStatus.PAYMENT_REQUIRED,);

  //       const payment = new PaymentEntity();
  //       payment.stripeId = charge.id;
  //       payment.amount = charge.amount / 100;
  //       payment.payment_method = charge.source.object;
  //       payment.billingId = billId;

  //       if (charge.payment_method_details.type === 'card') {
  //         payment.card_brand = charge.payment_method_details.card.brand;
  //         payment.exp_month = charge.payment_method_details.card.exp_month;
  //         payment.exp_year = charge.payment_method_details.card.exp_year;
  //         payment.last4 = charge.payment_method_details.card.last4;
  //       }
  //       payment.status = charge.status;
  //       await payment.save();

  //       const bill: BillingEntity = await BillingEntity.findOneBy({ id: billId });
  //       if (bill) {
  //         bill.isPaid = true;
  //         bill.paid = +bill.paid + charge.amount;
  //         await bill.save();
  //         const company = await CompanyEntity.findOneBy({ id: companyId });
  //         company.balance = +company.balance - payment.amount;
  //         await company.save();
  //         this.paymentGateway.notifyPayment(companyId, 'billPaid', billId);
  //       }
  //       return charge;
  //     } else {
  //       throw Error('Payment is not succeeded');
  //     }
  //   } else {
  //     throw new HttpException('No payment gateway installed', HttpStatus.NOT_FOUND,);
  //   }
  // };

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
