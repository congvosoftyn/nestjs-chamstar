import { forwardRef, Inject, Injectable, NotFoundException, } from '@nestjs/common';
import moment from 'moment';
import { AppointmentActivityEntity } from 'src/entities/AppointmentActivity.entity';
import { AppointmentBookingEntity } from 'src/entities/AppointmentBooking.entity';
import { CompanyCustomerEntity } from 'src/entities/CompanyCustomer.entity';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { ProductEntity } from 'src/entities/Product.entity';
import { StaffEntity } from 'src/entities/Staff.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import { StoreSettingEntity } from 'src/entities/StoreSetting.entity';
import { EmailService } from 'src/modules/email/email.service';
import TextMessage from 'src/shared/utils/Message';
import { PushNotification } from 'src/shared/utils/PushNotification';
import { BookingWebGateway } from './booking-web.gateway';

@Injectable()
export class BookingWebService {
  constructor(
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => BookingWebGateway))
    private bookingWebGateway: BookingWebGateway,
  ) { }

  async getCustomerByPhoneNumber(phoneNumber: string) {
    const customer = await CustomerEntity.findOne({
      where: { phoneNumber },
      select: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'countryCode',],
    });
    if (!customer) {
      throw new NotFoundException('Customer does not exist');
    }
    return customer;
  }


  // async bookAppointment(booking: AppointmentBookingEntity) {
  //   let { customer } = booking;
  //   if (!customer.id) { // new customer
  //     customer = await CustomerEntity.save(customer);
  //   }

  //   let companyCustomer = await CompanyCustomerEntity.findOne({ where: { customerId: customer.id } });
  //   if (!companyCustomer) { // new company customer
  //     let companyCustomer = new CompanyCustomerEntity();
  //     companyCustomer.companyId = booking.store.companyId;
  //     companyCustomer.customerId = booking.customer.id;
  //     companyCustomer.nickname = (customer.firstName || '') + ' ' + (customer.firstName || '')
  //     companyCustomer.customer = customer;
  //     await companyCustomer.save();
  //   }

  //   const newbooking = await AppointmentBookingEntity.save(booking);
  //   const activity = await AppointmentActivityEntity.save(<AppointmentActivityEntity>{
  //     storeId: booking.storeId,
  //     bookingId: newbooking.id,
  //     eventType: 'new'
  //   });
  //   activity.booking = newbooking;
  //   this.bookingWebGateway.sendNotiBookingWeb(booking.storeId, 'appointment-activity', activity);
  //   // await mail.sendConfirmAppointment(newbooking, booking.store.storeSetting.timeZone);
  //   const storeSetting = await StoreSettingEntity.findOne({ where: { storeId: newbooking.storeId } })
  //   let message = "";

  //   this.emailService.sendConfirmAppointment(newbooking.id, storeSetting.timeZone);
  //   message = `Your appointment has been booked with ${newbooking.staff.name} on ${moment(newbooking.date).tz(storeSetting.timeZone).format('MMMM Do YYYY @ h:mm a')} for ${newbooking.service.name}.`

  //   const push = new PushNotification(true);
  //   push.sendToStore(booking.storeId, message.replace('Your a', 'An a'))
  //   const text = new TextMessage();
  //   text.sendToCustomerId(newbooking.customerId, message, booking.store.companyId)

  //   return newbooking;
  // }

  async getServices(subDomain: string, staffName: string) {
    let builder = ProductEntity.createQueryBuilder('service')
      .leftJoin('service.store', 'store')
      .where('store.subDomain = :subDomain', { subDomain })
      .andWhere('service.isActive = true')
      .andWhere('service.isService = true')
      .andWhere('service.isPrivate = false')
      .orderBy('service.name', 'ASC');
    if (staffName) {
      builder = builder.leftJoinAndSelect('service.staffs', 'staffs', 'staffs.isActive = true AND staffs.directLink = :staffName', { staffName },);
    } else {
      builder = builder.leftJoinAndSelect('service.staffs', 'staffs', 'staffs.isActive = true',);
    }
    return await builder.getMany();
  }


  async getStaffByName(subDomain: string, staffName: string) {
    // byName?subDomain={subDomain}&staffName={name}
    let builder = await StaffEntity.createQueryBuilder('staff')
      .leftJoinAndSelect('staff.services', 'services', 'services.isPrivate = false AND services.isActive = true')
      .leftJoinAndSelect('staff.workingHours', 'workingHours')
      .leftJoinAndSelect('staff.breakTimes', 'breakTimes')
      .leftJoinAndSelect('staff.timeOffs', 'timeOffs')
      .leftJoin('staff.store', 'store')
      .where('store.subDomain = :subDomain', { subDomain })
      .andWhere('staff.isActive = true');
    if (staffName) {
      const staff = await builder.andWhere('staff.directLink = :staffName', { staffName }).getOne();
      if (!staff) throw new NotFoundException(staffName as string);
      return staff
    } else {
      return builder.getMany();
    }
  }

  async getStaffs(subDomain: string) {
    const store = await StoreEntity.findOne({ where: { subDomain } });
    if (!store) throw new NotFoundException('Store does not exist');

    return await StaffEntity.createQueryBuilder('staff')
      .leftJoinAndSelect('staff.services', 'services', 'services.isActive = true',)
      .leftJoinAndSelect('staff.workingHours', 'workingHours')
      .leftJoinAndSelect('staff.breakTimes', 'breakTimes')
      .where('staff.storeId=:storeId', { storeId: store.id })
      .andWhere('staff.isActive = true')
      .orderBy('staff.name', 'ASC')
      .getMany();
  }

  async getStore(subDomain: string) {
    const store = await StoreEntity.createQueryBuilder('store')
      .leftJoin('store.storeSetting', 'setting')
      .leftJoinAndSelect('store.appointmentSetting', 'appointmentSetting')
      .leftJoinAndSelect('store.openHours', 'openHours')
      .addSelect([
        'setting.timeZone', 'store.id', 'store.name',
        'store.address', 'store.email', 'store.city',
        'store.state', 'store.zipcode', 'store.latitude',
        'store.longitude', 'store.image', 'store.phoneNumber',
        'store.companyId',
      ])
      .where('store.subDomain = :subDomain', { subDomain })
      .getOne();

    if (!store) {
      throw new NotFoundException('Store does not exist');
    }
    return store;
  }
}
