import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentBookingEntity } from 'src/entities/AppointmentBooking.entity';
import { CheckOutDto } from './dto/CheckOut.dto';
import { BillingEntity } from 'src/entities/Billing.entity';
import { BookingService } from '../appointment/booking/booking.service';
import { BillingDetailEntity } from 'src/entities/BillingDetailt.entity';
import { CreateAppointmentDto } from '../appointment/booking/dto/create-booking.dto';

@Injectable()
export class CheckinService {
  constructor(private bookingService: BookingService) { }

  // async checkIn(_checkIn: CheckInDto, companyId: number, storeId?: number, customerId?: number) {
  //   let phoneNumber = _checkIn.phoneNumber;

  //   let customer: CustomerEntity;
  //   if (phoneNumber) {
  //     phoneNumber = phoneNumber.match(/\d+/g).join("");
  //     customer = await CustomerEntity.findOneBy({ phoneNumber });
  //     if (!customer) {
  //       customer = new CustomerEntity();
  //       customer.phoneNumber = phoneNumber;
  //       customer = await CustomerEntity.save(customer);
  //     }
  //   } else {
  //     customer = await CustomerEntity.findOneBy({ id: customerId });
  //   }

  //   let companyCustomer = await CompanyCustomerEntity.findOne({ where: { customerId: customer.id, companyId: companyId }, relations: ["customer"] });
  //   if (!companyCustomer) {
  //     companyCustomer = new CompanyCustomerEntity();
  //     companyCustomer.customerId = customer.id;
  //     companyCustomer.companyId = companyId;
  //     companyCustomer.nickname = (customer.firstName || "") + " " + (customer.lastName || "");
  //     companyCustomer.totalPoint = 0;
  //     // this.checkinGateway.sendNotifyCheckIn(storeId, "newCustomer", 1);
  //     CompanyCustomerEntity.save(companyCustomer);
  //   }

  //   const setting = await StoreSettingEntity.findOne({ where: { storeId: storeId }, relations: ["store"] });
  //   const afterDate = Date.now() - setting.allowCheckinAfter * 1000 * 60 * 60;
  //   let checkin = await CheckInEntity.findOne({ where: { companyCustomerId: companyCustomer.id, checkInDate: MoreThanOrEqual(new Date(afterDate)) } });

  //   if (!checkin) {
  //     companyCustomer.totalPoint += 1;
  //     companyCustomer.lastCheckIn = new Date();
  //     await CompanyCustomerEntity.save(companyCustomer);
  //     checkin = new CheckInEntity();
  //     checkin.checkInDate = new Date();
  //     const nanoid = customAlphabet('1234567890abcdef', 10)
  //     checkin.stringId = nanoid();
  //     checkin.companyCustomer = companyCustomer;
  //     const store = await StoreEntity.findOneBy({ id: storeId });
  //     if (store) checkin.store = store;
  //     else throw new HttpException('Wrong authentication token', HttpStatus.UNAUTHORIZED);

  //     if (setting && setting.autoCheckout && setting.checkoutAfter === 0) {
  //       checkin.checkOutDate = new Date();
  //     }

  //     await checkin.save();
  //     companyCustomer.customer = customer;
  //     //find booking if customer has one
  //     const booking = await AppointmentBookingEntity
  //       .createQueryBuilder("booking")
  //       .leftJoin("booking.customer", "customer")
  //       .orderBy({ date: "DESC" })
  //       .where("booking.storeId = :storeId", { storeId })
  //       .andWhere("customer.id = :customerId", { customerId: customer.id })
  //       .andWhere("booking.isActive=true")
  //       .getOne();
  //     if (booking) AppointmentBookingEntity.update(booking.id, { isCheckIn: true });

  //     return { checkIn: checkin, isAlreadyCheckIn: false };
  //   } else {
  //     return { checkIn: checkin, isAlreadyCheckIn: true, message: "Customer already checked in with in " + setting.allowCheckinAfter + " hours", }
  //   }
  // }


  // async checkinCount(companyId: number) {
  //   const start = new Date();
  //   const end = new Date();
  //   end.setHours(0, 0, 0, 0);

  //   const filters: any = {
  //     before: start.toISOString() as any,
  //     after: end.toISOString() as any,
  //   };

  //   return CompanyCustomerEntity.createQueryBuilder('company_customer')
  //     .leftJoinAndSelect('company_customer.customer', 'customer')
  //     .innerJoinAndSelect('company_customer.checkIn', 'checkIn')
  //     .where({ companyId })
  //     .andWhere('checkIn.checkInDate >= :after')
  //     .andWhere('checkIn.checkInDate < :before')
  //     .orderBy({ checkInDate: 'DESC' })
  //     .setParameters(filters)
  //     .getCount();
  // }

  async checkOut(body: CheckOutDto) {
    const booking = await AppointmentBookingEntity.createQueryBuilder('booking')
      .leftJoin("booking.customer", "customer")
      .addSelect(["customer.id", "customer.firstName", "customer.lastName"])
      .leftJoinAndSelect("booking.bookingInfo", "bookingInfo")
      .where("booking.id = :id", { id: body.bookingId })
      .getOne();

    if (!booking) throw new NotFoundException("Not found booking")

    let newBilling = await BillingEntity.save(<BillingEntity>{
      startTime: body.startTime,
      day: booking.date,
      storeId: booking.storeId,
      customerId: booking.customerId,
      discount: body.discount,
      coupon: body.coupon,
      note: body?.note,
      extraTime: booking.extraTime,
      total: body.total,
    });

    if (body.products && body.products.length > 0) {
      let _billingDetail = []

      for (const product of body.products) {
        _billingDetail.push(<BillingDetailEntity>{
          productId: product.id,
          quantity: product.quantity
        })
      }

      BillingDetailEntity.save(_billingDetail);
    }

    let billingDetail = []

    if (booking) {
      billingDetail.push(<BillingDetailEntity>{ billingId: newBilling.id, bookingId: body.bookingId })
    }

    if (body.services && body.services.length > 0 || body.packages && body.packages.length > 0) {
      const _booking = await this.bookingService.createBookAppointment(<CreateAppointmentDto>{
        customerId: booking.customerId,
        date: body.date,
        lastDate: body.date,
        services: body.services ? body.services : [],
        packages: body.packages ? body.packages : [],
      }, booking.storeId)

      billingDetail.push(<BillingDetailEntity>{ billingId: newBilling.id, bookingId: _booking.id })
    }

    BillingDetailEntity.save(billingDetail);

    return newBilling
  }

  // async checkInCustomers(companyId: number) {
  //   const start = new Date();
  //   const end = new Date();
  //   end.setHours(0, 0, 0, 0);

  //   const filters: any = {
  //     before: start.toISOString() as any,
  //     after: end.toISOString() as any,
  //   };

  //   return CompanyCustomerEntity
  //     .createQueryBuilder('company_customer')
  //     .leftJoinAndSelect('company_customer.customer', 'customer')
  //     .innerJoinAndSelect('company_customer.checkIn', 'checkIn')
  //     .where({ companyId })
  //     .andWhere('checkIn.checkInDate >= :after')
  //     .andWhere('checkIn.checkInDate < :before')
  //     .orderBy({ checkInDate: 'DESC' })
  //     .setParameters(filters)
  //     .getMany();
  // }
}
