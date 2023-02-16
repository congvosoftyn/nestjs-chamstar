import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppointmentBookingEntity } from 'src/entities/AppointmentBooking.entity';
import { BillingEntity } from 'src/entities/Billing.entity';
import { CheckInEntity } from 'src/entities/CheckIn.entity';
import { CompanyEntity } from 'src/entities/Company.entity';
import { CompanyCustomerEntity } from 'src/entities/CompanyCustomer.entity';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { CustomerGroupEntity } from 'src/entities/CustomerGroup.entity';
import { PackageEntity } from 'src/entities/Package.entity';
import { PromotionEntity } from 'src/entities/Promotion.entity';
import { SiteSettingEntity } from 'src/entities/SiteSetting.entity';
import { StoreSettingEntity } from 'src/entities/StoreSetting.entity';
import { SubscriptionEntity } from 'src/entities/Subscription.entity';
import { UserEntity } from 'src/entities/User.entity';
import TextMessage from 'src/shared/utils/Message';
import { LessThanOrEqual } from 'typeorm';
import { EmailService } from '../email/email.service';
import { StripesService } from '../stripes/stripes.service';


@Injectable()
export class CronJobService {
    constructor(
        private emailService: EmailService,
        private stripesService: StripesService
    ) { }

    // @Cron('* * * * * *')
    // public async checkBill() {
    //     //create bill if subscription has no bill 
    //     const noBillSub = await SubscriptionEntity
    //         .createQueryBuilder('sub')
    //         .leftJoinAndSelect('sub.package', 'package')
    //         .leftJoin('sub.billings', 'billings')
    //         .where('billings.id IS NULL').getMany();
    //     noBillSub.forEach(sub => this.createNewBill(sub));

    //     const subscriptions = await SubscriptionEntity
    //         .createQueryBuilder('sub')
    //         .leftJoin('sub.company', 'company')
    //         .leftJoinAndSelect('sub.package', 'package')
    //         .leftJoin((subQuery) => subQuery.from(BillingEntity, 'billing')
    //             .select(['Max(billing.endDate) as endDate', 'billing.subscriptionId as subscriptionId'])
    //             .groupBy('billing.subscriptionId')
    //             , 'bb', 'bb.subscriptionId = sub.id')
    //         .where('bb.endDate < CURDATE()')
    //         .andWhere('company.isActive = true').getMany();

    //     subscriptions.forEach(async sub => {
    //         if (sub.package.isAutoUpgrade && sub.package.isUpgradable && sub.package.autoUpgradePackageId) {
    //             //Check how many bill cycle with this package
    //             const lastBills = await BillingEntity.count({ where: { subscriptionId: sub.id }, order: { startDate: 'DESC' } });
    //             //If total last bill more than autoUpgradeAfter billing cycle
    //             if (lastBills >= sub.package.autoUpgradeAfter) {
    //                 //upgrade to new package and create new bill
    //                 sub.packageId = sub.package.autoUpgradePackageId;
    //                 await sub.save();
    //                 await this.createNewBill(sub);
    //                 if (sub.package.price == 0) {
    //                     const newPackage = await PackageEntity.findOne(sub.package.autoUpgradePackageId);
    //                     if (newPackage) {
    //                         let body = this.emailService.getMailTemplate("../email-temp/trial-end.html");
    //                         body = body.replace(new RegExp("{{package}}", 'g'), newPackage.name);
    //                         body = body.replace(new RegExp("{{day}}", 'g'), sub.package.billingCycle.toString());
    //                         const firstUser = await UserEntity.findOne({ companyId: sub.companyId });
    //                         if (firstUser)
    //                             await this.emailService.sendMail({
    //                                 from: '"Uzmos"<no-reply@uzmos.com>',
    //                                 to: firstUser.email,
    //                                 subject: 'Trial End',
    //                                 html: body
    //                             });
    //                     }
    //                 }
    //             } else {
    //                 this.createNewBill(sub);
    //             }
    //         } else if (sub.package.isAutoRenew) { // Auto renew current package
    //             this.createNewBill(sub);
    //         } else { // stop company from subscription
    //             await CompanyEntity.update(sub.companyId, { isActive: false });
    //         }

    //     })
    // }

    // public async checkCheckin() {
    //     const checkins = await CheckInEntity.createQueryBuilder('checkin')
    //         .innerJoinAndSelect('checkin.store', 'store', 'store.isActive = true')
    //         .innerJoinAndSelect('store.storeSetting', 'storeSetting', "storeSetting.sendCheckinMessage = true")
    //         .leftJoinAndSelect('checkin.companyCustomer', 'companyCustomer')
    //         .leftJoinAndSelect('companyCustomer.customer', 'customer')
    //         .andWhere('checkin.checkInMessageSent = false')
    //         .andWhere('checkin.checkinDate BETWEEN DATE_SUB(NOW(), INTERVAL 5 MINUTE) AND NOW()')
    //         .getMany();
    //     this.asyncForEach(checkins, async (checkin: CheckInEntity) => {
    //         let message;
    //         if (checkin.store.storeSetting.autoGeneratedCheckinMessage) {
    //             message = 'You are checked in at ' + checkin.store.name;
    //         } else {
    //             message = checkin.store.storeSetting.customCheckinMessage;
    //         }
    //         const textMessage = new TextMessage();
    //         const result = await textMessage.sendToCustomer(checkin.companyCustomer.customer, message, checkin.companyCustomer.companyId);
    //         if (result) {
    //             checkin.checkInMessageSent = true;
    //             await checkin.save();
    //         }
    //     });
    // }

    // @Cron('* * * * * *')
    // public async checkCheckOut() {
    //     const checkouts = await CheckInEntity.createQueryBuilder('checkin')
    //         .innerJoinAndSelect('checkin.store', 'store', 'store.isActive = true')
    //         .innerJoinAndSelect('store.storeSetting', 'storeSetting', "storeSetting.sendCheckoutMessage = true")
    //         .leftJoinAndSelect('checkin.companyCustomer', 'companyCustomer')
    //         .leftJoinAndSelect('companyCustomer.customer', 'customer')
    //         .andWhere('checkin.checkOutMessageSent = false')
    //         .andWhere('checkin.checkinDate BETWEEN DATE_SUB(DATE_SUB(NOW(), INTERVAL storeSetting.checkoutAfter HOUR), INTERVAL 5 MINUTE) AND DATE_SUB(NOW(), INTERVAL storeSetting.checkoutAfter HOUR)')
    //         .getMany();
    //     if (checkouts && checkouts.length > 0) {
    //         this.asyncForEach(checkouts, async (checkout: CheckInEntity) => {
    //             let message: string;
    //             // const storeSetting = await StoreSetting.findOne({storeId: checkout.storeId})
    //             message = checkout.store.storeSetting.customCheckoutMessage
    //                 ? checkout.store.name + ': ' + checkout.store.storeSetting.customCheckoutMessage
    //                 : checkout.store.name + ': Thanks for choosing us. How was your experience? ';
    //             const reviewURL = 'https://uzmos.com/r/?review=' + checkout.stringId;
    //             message += reviewURL;
    //             const textMessage = new TextMessage();
    //             const result = await textMessage.sendToCustomer(checkout.companyCustomer.customer, message, checkout.companyCustomer.companyId);
    //             checkout.checkOutDate = new Date();
    //             if (result) {
    //                 checkout.checkOutMessageSent = true;
    //             }
    //             await checkout.save();
    //         })
    //     }
    // }

    // @Cron('0 9 * * * *', { timeZone: 'America/Los_Angeles' })
    // public async checkBirthDay() {
    //     try {
    //         const customers = await CustomerEntity.createQueryBuilder()
    //             .where(`DATE_FORMAT(FROM_UNIXTIME(dob),'%m-%d') = DATE_FORMAT(NOW(),'%m-%d')`)
    //             .getMany();
    //         this.asyncForEach(customers, async (customer: CustomerEntity) => {
    //             const cCustomers = await CompanyCustomerEntity.find({ where: { customerId: customer.id }, relations: ['company', 'company.companySetting'] });
    //             this.asyncForEach(cCustomers, async (cCustomer: CompanyCustomerEntity) => {
    //                 if (cCustomer.company.companySetting.sendBirthdayMessage) {
    //                     let message = cCustomer.company.name + ': Happy birthday, ' + customer.firstName + '! We would like you have 10% off on your order. Enjoy your day.'
    //                     if (cCustomer.company.companySetting.customBirthdayMessage) {
    //                         message = cCustomer.company.companySetting.customBirthdayMessage;
    //                     }
    //                     const textMessage = new TextMessage();
    //                     await textMessage.sendToCustomer(cCustomer.customer, message, cCustomer.companyId);
    //                 }
    //             })
    //         })

    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    // @Cron('0 9 * * * *', { timeZone: 'America/Los_Angeles' })
    // public async checkRemind() {
    //     const storeSettings = await StoreSettingEntity.find({ where: { store: { isActive: true }, autoSendRemindMessage: true }, relations: ['store'] });
    //     this.asyncForEach(storeSettings, async (setting: StoreSettingEntity) => {
    //         const after = new Date();
    //         after.setTime(after.getTime() - 1000 * 3600 * 24 * setting.sendRemindMessageAfter);
    //         const customers = await CompanyCustomerEntity.find({ where: { companyId: setting.store.companyId, lastCheckIn: LessThanOrEqual(after), remindSent: false }, relations: ['customer'] });
    //         this.asyncForEach(customers, async (customer: CompanyCustomerEntity) => {
    //             let message = "We haven't seen you at " + setting.store.name + ". Come by for a visit and get 10% off on your order";
    //             if (setting.customClaimedMessage) {
    //                 message = setting.customRemindMessage;
    //             }
    //             const textMessage = new TextMessage();
    //             const result = await textMessage.sendToCustomer(customer.customer, message, customer.companyId);
    //             if (result) {
    //                 customer.remindSent = true;
    //                 customer.save();
    //             }
    //         })
    //     })
    // }

    // @Cron('* * * * * *')
    // public async checkPromotion() {
    //     //check promotions 
    //     const promotions = await PromotionEntity.find({ where: { isSend: false, startDate: LessThanOrEqual(new Date()) }, relations: ['company'] });
    //     this.asyncForEach(promotions, async (promotion: PromotionEntity) => {
    //         const groups = promotion.groups.split(',').map(Number);
    //         //All customer 

    //         if (groups.includes(0)) {
    //             const allCustomer = await CompanyCustomerEntity.find({ where: { companyId: promotion.company.id }, relations: ['customer', 'customer.promotions'] });
    //             await this.asyncForEach(allCustomer, async (customer: CompanyCustomerEntity) => {
    //                 customer.customer.promotions.push(promotion);
    //                 await customer.customer.save();
    //                 const message = new TextMessage();
    //                 await message.sendToCustomer(customer.customer, promotion.company.name + ": " + promotion.description + ' EXP:' + new Intl.DateTimeFormat('en-US').format(promotion.endDate), customer.companyId);
    //             });
    //         } else {
    //             const customers: CompanyCustomerEntity[] = [];
    //             if (groups.includes(-1)) {
    //                 const storeCustomers = await CompanyCustomerEntity.getRepository()
    //                     .createQueryBuilder("companyCustomer")
    //                     .leftJoin("companyCustomer.checkIn", "checkIn")
    //                     .where({ companyId: promotion.companyId })
    //                     .andWhere("checkIn.storeId=" + promotion.storeId).getMany();
    //                 storeCustomers.forEach(c => {
    //                     if (!customers.find(cs => cs.id !== c.id)) {
    //                         customers.push(c);
    //                     }
    //                 })
    //             }
    //             if (groups.includes(-2)) {
    //                 const newCustomer = await CheckInEntity
    //                     .createQueryBuilder('g')
    //                     .leftJoinAndSelect('g.companyCustomer', 'customer')
    //                     .where({ storeId: promotion.storeId })
    //                     .having("COUNT(companyCustomerId)=1")
    //                     .groupBy("companyCustomerId").getMany();
    //                 newCustomer.forEach(c => {
    //                     if (!customers.find(cs => cs.id !== c.companyCustomer.id)) {
    //                         customers.push(c.companyCustomer);
    //                     }
    //                 });
    //             }
    //             if (groups.includes(-3)) {
    //                 const regularCustomer = await CheckInEntity
    //                     .createQueryBuilder('g')
    //                     .leftJoinAndSelect('g.companyCustomer', 'customer')
    //                     .where({ storeId: promotion.storeId })
    //                     .having("COUNT(companyCustomerId)>1")
    //                     .groupBy("companyCustomerId").getMany();
    //                 regularCustomer.forEach(c => {
    //                     if (!customers.find(cs => cs.id !== c.companyCustomer.id)) {
    //                         customers.push(c.companyCustomer);
    //                     }
    //                 });
    //             }
    //             const otherGroups = await CustomerGroupEntity
    //                 .createQueryBuilder('g')
    //                 .where({ companyId: promotion.company.id }).andWhereInIds(groups)
    //                 .leftJoinAndSelect('g.companyCustomer', 'customer')
    //                 .getMany();
    //             //Merge customers

    //             otherGroups.forEach(g => {
    //                 g.companyCustomer.forEach(c => {
    //                     if (!customers.find(cs => cs.id !== c.id)) {
    //                         customers.push(c);
    //                     }
    //                 });
    //             });

    //             await this.asyncForEach(customers, async (customer: CompanyCustomerEntity) => {
    //                 customer.customer = await CustomerEntity.findOne(customer.customerId, { relations: ['customer.promotions'] });
    //                 customer.customer.promotions.push(promotion);
    //                 await customer.customer.save();
    //                 const message = new TextMessage();
    //                 await message.sendToCustomerId(customer.id, promotion.company.name + ": " + promotion.description + ' EXP:' + new Intl.DateTimeFormat('en-US').format(promotion.endDate));
    //             })

    //         }
    //         // Save promotion
    //         promotion.isSend = true;
    //         promotion.save();
    //     });
    // }

    // async asyncForEach(array, callback) {
    //     for (let index = 0; index < array.length; index++) {
    //         await callback(array[index], index, array);
    //     }
    // }

    // private async createNewBill(subs: SubscriptionEntity) {
    //     if (!subs.isActive) {
    //         subs.isActive = true;
    //         subs.save();
    //     }
    //     const bill = new BillingEntity();
    //     bill.subscriptionId = subs.id;
    //     bill.created = new Date();
    //     bill.startDate = new Date();

    //     if (subs.package) {
    //         bill.endDate = new Date();
    //         bill.endDate.setDate(bill.endDate.getDate() + subs.package.billingCycle);
    //         bill.dueDate = new Date(bill.endDate);
    //         bill.dueDate.setDate(bill.dueDate.getDate() - 10);
    //         if (subs.package.price === 0) {
    //             bill.isPaid = true;
    //             bill.paid = subs.package.price;
    //         } else {
    //             bill.dueAmount = subs.package.price;
    //         }
    //     }
    //     return await bill.save();
    // }

    // // private async checkMessageBalance(companyId: number) {
    // //     const subs = await BillingEntity.findOne({where : {companyId}, relations: ['package']});
    // //     const bill = await BillingEntity.findOne({where : {companyId}, relations: ['addons'], order:{startDate:"DESC"}});
    // //     const messageSent = await MessageSentEntity.count({where: {companyId, created: Between(bill.startDate, bill.endDate)}});   
    // //     let bal = 0;
    // //     bal = bill.package.messageUsage - messageSent;
    // //     bill.addons.forEach(addon => {
    // //         bal += (+addon.messageUsage);
    // //     });
    // //     return bal;
    // // }

    // @Cron('0 9 * * * *', { timeZone: 'America/Los_Angeles', })
    // public async checkDueDateBill() {
    //     const bills = await BillingEntity.createQueryBuilder('billing')
    //         .innerJoinAndSelect("billing.subscription", "subscription")
    //         .innerJoinAndSelect("subscription.company", "company")
    //         .where(`DATE_FORMAT(FROM_UNIXTIME(dueDate),'%Y-%m-%d') = DATE_FORMAT(NOW(),'%Y-%m-%d')`)
    //         .andWhere('company.isActive = true')
    //         .andWhere('company.balance <= 0')
    //         .andWhere('billing.isPaid = false')
    //         .getMany();
    //     const paymentGateway = await this.checkPaymentGateway();
    //     bills.forEach(async (b) => {
    //         if (paymentGateway.value === 'stripe') {
    //             if (b.subscription.company.stripeCustomerId) {
    //                 const stripeCus: any = await this.stripesService.getCustomer(b.subscription.companyId);
    //                 if (stripeCus.default_source) {
    //                     const user = await UserEntity.findOne({ companyId: b.subscription.companyId })
    //                     await this.stripesService.createACustomerCharge(stripeCus.default_source.toString(), b.dueAmount, b.subscription.companyId, user.id)
    //                 }
    //             }
    //         }
    //     });
    // }

    // @Cron('* * * * * *')
    // public async checkBookingRemider() {
    //     const bookings = await AppointmentBookingEntity
    //         .createQueryBuilder('booking')
    //         .leftJoinAndSelect('booking.store', 'store')
    //         .leftJoinAndSelect('booking.staff', 'staff')
    //         .leftJoinAndSelect('booking.service', 'service')
    //         .leftJoinAndSelect('store.storeSetting', 'storeSetting')
    //         .leftJoinAndSelect('store.appointmentSetting', 'appointmentSetting')
    //         .where('booking.date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL appointmentSetting.reminderInMinute minute)')
    //         .andWhere('booking.remiderSent = false')
    //         .andWhere('appointmentSetting.reminder = true')
    //         .andWhere('booking.isActive = true')
    //         .getMany();
    //     const text = new TextMessage();

    //     bookings.forEach(async booking => {
    //         //Send Message
    //         const message = await TextMessage.bookingMessageReplace(booking.store.appointmentSetting.bookingReminderMessage, booking);
    //         await text.sendToCustomerId(booking.customerId, message, booking.store.companyId);
    //         await AppointmentBookingEntity.update(booking.id, { remiderSent: true });
    //     })
    // }

    // @Cron('* * * * * *')
    // public async followUpBookingMessage() {
    //     try {
    //         const bookings = await AppointmentBookingEntity
    //             .createQueryBuilder('booking')
    //             .leftJoinAndSelect('booking.store', 'store')
    //             .leftJoinAndSelect('booking.staff', 'staff')
    //             .leftJoinAndSelect('booking.service', 'service')
    //             .leftJoinAndSelect('store.storeSetting', 'storeSetting')
    //             .leftJoinAndSelect('store.appointmentSetting', 'appointmentSetting')
    //             .where('booking.date BETWEEN DATE_ADD(NOW(), INTERVAL service.serviceDuration + appointmentSetting.folllowUpAfterMinute minute) AND DATE_ADD(NOW(), INTERVAL service.serviceDuration + appointmentSetting.folllowUpAfterMinute + 10 minute)')
    //             .andWhere('booking.followUpSent = false')
    //             .andWhere('appointmentSetting.folllowUp = true')
    //             .andWhere('booking.isActive = true')
    //             .getMany();
    //         const text = new TextMessage();

    //         bookings.forEach(async booking => {
    //             //Send Message
    //             const message = await TextMessage.bookingMessageReplace(booking.store.appointmentSetting.folllowUpMessage, booking);
    //             await text.sendToCustomerId(booking.customerId, message, booking.store.companyId);
    //             await AppointmentBookingEntity.update(booking.id, { followUpSent: true });
    //         })
    //     } catch { }
    // }

    // @Cron('* * * * * *')
    // public async didNotShowBookingMessage() {
    //     const bookings = await AppointmentBookingEntity
    //         .createQueryBuilder('booking')
    //         .leftJoinAndSelect('booking.store', 'store')
    //         .leftJoinAndSelect('booking.staff', 'staff')
    //         .leftJoinAndSelect('booking.service', 'service')
    //         .leftJoinAndSelect('store.storeSetting', 'storeSetting')
    //         .leftJoinAndSelect('store.appointmentSetting', 'appointmentSetting')
    //         .where('booking.date BETWEEN DATE_ADD(NOW(), INTERVAL appointmentSetting.didNotShowAfterMinute minute) AND DATE_ADD(NOW(), INTERVAL appointmentSetting.didNotShowAfterMinute + 30 minute)')
    //         .andWhere('booking.didNotShowSent = false')
    //         .andWhere('appointmentSetting.didNotShow = true')
    //         .andWhere('booking.didNotShow = true')
    //         .getMany();
    //     const text = new TextMessage();
    //     bookings.forEach(async booking => {
    //         //Send Message
    //         const message = await TextMessage.bookingMessageReplace(booking.store.appointmentSetting.didNotShowMessage, booking);
    //         await text.sendToCustomerId(booking.customerId, message, booking.store.companyId);
    //         await AppointmentBookingEntity.update(booking.id, { didNotShowSent: true });
    //     })
    // }

    // @Cron('0 9 * * * *', { timeZone: 'America/Los_Angeles' })
    // public async checkRebookingReminder() {
    //     const bookings = await AppointmentBookingEntity
    //         .createQueryBuilder('booking')
    //         .leftJoinAndSelect('booking.store', 'store')
    //         .leftJoinAndSelect('booking.customer', 'customer')
    //         .leftJoin(
    //             qb =>
    //                 qb.from(AppointmentBookingEntity, 'check_booking')
    //                     .select('MAX(check_booking.date)', 'date')
    //                     .addSelect('customerId', 'customerId')
    //                     .addSelect('storeId', 'storeId')
    //                     .groupBy('storeId, customerId'),
    //             'latest_booking',
    //             'latest_booking.customerId = customer.id AND latest_booking.storeId = store.id'
    //         )
    //         .leftJoinAndSelect('store.storeSetting', 'storeSetting')
    //         .leftJoinAndSelect('booking.staff', 'staff')
    //         .leftJoinAndSelect('booking.service', 'service')
    //         .leftJoinAndSelect('store.appointmentSetting', 'appointmentSetting')
    //         .where('booking.date BETWEEN DATE_SUB(NOW(), INTERVAL appointmentSetting.rebookingReminderInDay + 1 DAY) AND DATE_SUB(NOW(), INTERVAL appointmentSetting.rebookingReminderInDay DAY)')
    //         .andWhere('appointmentSetting.rebookingReminder = true')
    //         .andWhere('booking.isActive = true')
    //         .andWhere('booking.date = latest_booking.date')
    //         .getMany();

    //     const text = new TextMessage();
    //     bookings.forEach(async booking => {
    //         //Send Message
    //         //STORE_NAME, FIRST_NAME, LAST_NAME, STORE_PHONE, STAFF_FIRSTNAME, STAFF_LASTNAME, BOOKING_DATE_TIME, STORE_ADDRESS, STORE_LINK
    //         const message = await TextMessage.bookingMessageReplace(booking.store.appointmentSetting.rebookingReminderMessage, booking)
    //         //  booking.store.appointmentSetting.rebookingReminderMessage
    //         //     .replace('{{customer}}', booking.customer.firstName + ' ' + booking.customer.lastName)
    //         //     .replace('{{store}}', booking.store.name)
    //         //     .replace('{{link}}', booking.store.subDomain + ".uzmos.com");
    //         await text.sendToCustomerId(booking.customerId, message, booking.store.companyId);
    //     })
    // }


    // private async checkPaymentGateway() {
    //     let paymentGateway = await SiteSettingEntity.findOne({ where: { key: 'paymentGateway' } });
    //     if (!paymentGateway) {
    //         paymentGateway = new SiteSettingEntity();
    //         paymentGateway.key = 'paymentGateway';
    //         paymentGateway.value = 'stripe';
    //         await paymentGateway.save();
    //     }
    //     return paymentGateway;
    // }
}
