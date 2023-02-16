import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, } from '@nestjs/common';
import moment from 'moment';
import { AppointmentActivityEntity } from 'src/entities/AppointmentActivity.entity';
import { AppointmentBookingEntity } from 'src/entities/AppointmentBooking.entity';
import { AppointmentSettingEntity } from 'src/entities/AppointmentSetting.entity';
import { CompanyCustomerEntity } from 'src/entities/CompanyCustomer.entity';
import { ProductEntity } from 'src/entities/Product.entity';
import { StoreSettingEntity } from 'src/entities/StoreSetting.entity';
import { EmailService } from 'src/modules/email/email.service';
import TextMessage from 'src/shared/utils/Message';
import { PushNotification } from 'src/shared/utils/PushNotification';
import { BookingAppGateway } from './booking-app.gateway';

@Injectable()
export class BookingAppService {
  constructor(
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => BookingAppGateway))
    private bookingAppGateway: BookingAppGateway,
  ) { }

  async getHistory(skip: number, take: number, customerId: number) {
    return await AppointmentBookingEntity.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.service', 'service')
      .leftJoinAndSelect('booking.staff', 'staff')
      .leftJoinAndSelect('booking.store', 'store')

      .where('booking.customerId = :customerId', { customerId })
      .andWhere('booking.isActive = true')
      .orderBy('booking.date', 'DESC')
      .take(+take || 10)
      .skip(+skip || 0)
      .getMany();
  }

  async getServices(id: number) {
    const builder = ProductEntity.createQueryBuilder('service')
      .leftJoin('service.store', 'store')
      .leftJoinAndSelect('service.staffs', 'staffs', 'staffs.isActive = true')
      .where('store.id = :id', { id })
      .andWhere('service.isActive = true')
      .andWhere('service.isService = true')
      .andWhere('service.isPrivate = false')
      .orderBy('service.name', 'ASC');

    return await builder.getMany();
  }

  // async bookAppointment(booking: AppointmentBookingEntity, customerId: number) {
  //   const lastDate = booking.lastDate;
  //   const isNew =
  //     lastDate && !moment(lastDate).isSame(booking.date) ? false : true;
  //   const hasId = booking.id ? true : false;

  //   booking.customerId = booking.customerId || customerId;
  //   const companyCustomer = await CompanyCustomerEntity.findOne({
  //     where: { customerId },
  //     relations: ['customer'],
  //   });
  //   if (!companyCustomer) {
  //     // new company customer
  //     const companyCustomer = new CompanyCustomerEntity();
  //     companyCustomer.companyId = booking.store.companyId;
  //     companyCustomer.customerId = customerId;
  //     await companyCustomer.save();
  //   }

  //   const newbooking = await AppointmentBookingEntity.save(booking);
  //   const activity = await AppointmentActivityEntity.save(<
  //     AppointmentActivityEntity
  //     >{
  //       storeId: booking.storeId,
  //       bookingId: newbooking.id,
  //       eventType: isNew ? 'new' : 'reschedule',
  //     });
  //   activity.booking = newbooking;
  //   this.bookingAppGateway.sendNotiBookingApp(
  //     booking.storeId,
  //     'appointment-activity',
  //     activity,
  //   );
  //   const storeSetting = await StoreSettingEntity.findOne({
  //     where: { storeId: newbooking.storeId },
  //   });
  //   const bookingSetting = await AppointmentSettingEntity.findOne({
  //     where: { storeId: newbooking.storeId },
  //   });
  //   let message = '';
  //   if (!hasId) {
  //     this.emailService.sendConfirmAppointment(newbooking.id, storeSetting.timeZone,);
  //     message = await TextMessage.bookingMessageReplace(bookingSetting.bookingConfirmedMessage, booking,);
  //   } else if (!isNew) {
  //     newbooking.customer = newbooking.customer || companyCustomer.customer;
  //     this.emailService.sendRescheduleAppointment(newbooking.id, storeSetting.timeZone,);
  //     message = await TextMessage.bookingMessageReplace(bookingSetting.bookingChangedMessage, booking,);
  //   }
  //   const push = new PushNotification(true);
  //   push.sendToStore(booking.storeId, message.replace('Your a', 'An a'));
  //   const text = new TextMessage();
  //   text.sendToCustomerId(
  //     newbooking.customerId,
  //     message,
  //     booking.store.companyId,
  //   );

  //   return newbooking;
  // }

  // async deleteAppointment(id: number) {
  //   //     const {storeId, companyId} = response.locals.jwtPayload;
  //   const deleteB = await AppointmentBookingEntity.createQueryBuilder('booking')
  //     .leftJoinAndSelect('booking.store', 'store')
  //     .leftJoinAndSelect('booking.staff', 'staff')
  //     .leftJoinAndSelect('booking.service', 'service')
  //     .leftJoinAndSelect('store.appointmentSetting', 'appointmentSetting')
  //     .leftJoinAndSelect('store.storeSetting', 'storeSetting')
  //     .where('booking.id = :id', { id })
  //     .andWhere('booking.isActive = true')
  //     .getOne();
  //   deleteB.isActive = false;
  //   if (deleteB) {
  //     if (deleteB.store.appointmentSetting.cancellationPolicy > 0) {
  //       const isAllowed = moment().add(deleteB.store.appointmentSetting.cancellationPolicy, 'hours').isBefore(deleteB.date);

  //       if (!isAllowed) {
  //         throw new BadRequestException('Invalid request - Validation Failed!');
  //       }
  //     }
  //     const activity = await AppointmentActivityEntity.save(<AppointmentActivityEntity>{ storeId: deleteB.storeId, bookingId: deleteB.id, eventType: 'cancel', }); activity.booking = deleteB;
  //     this.bookingAppGateway.sendNotiBookingApp(deleteB.storeId, 'appointment-activity', activity,);
  //     const result = await AppointmentBookingEntity.update(deleteB.id, { isActive: false, });

  //     const text = new TextMessage();
  //     const bookingSetting = await AppointmentSettingEntity.findOne({ where: { storeId: deleteB.storeId }, });
  //     const message = await TextMessage.bookingMessageReplace(bookingSetting.bookingCancelledMessage, deleteB,);
  //     //send push notification to store
  //     const push = new PushNotification(true);
  //     push.sendToStore(deleteB.storeId, message.replace('Your a', 'An a'));
  //     text.sendToCustomerId(deleteB.customerId, message, deleteB.store.companyId,);
  //     return result;
  //   } else {
  //     throw new NotFoundException(`not found with id ${id}`);
  //   }
  // }
}
