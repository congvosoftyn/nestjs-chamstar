import { BillingEntity } from 'src/entities/Billing.entity';
import { Injectable } from '@nestjs/common';
import { AppointmentBookingEntity } from 'src/entities/AppointmentBooking.entity';
import { QueryReportDto } from './dto/QueryReport';

@Injectable()
export class ReportService {
  get12MonthReports(staffId: number, storeId: number) {
    const toDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 24);
    let transactionQuery = AppointmentBookingEntity.createQueryBuilder('booking')
      .select('MONTH(booking.date)', 'month')
      .addSelect('YEAR(booking.date)', 'year')
      .addSelect('SUM(service.price)', 'total')
      .addSelect('COUNT(booking.id)', 'count')
      .orderBy('booking.date', 'ASC')
      .leftJoin('booking.service', 'service')
      .where('booking.date >= :startDate', { startDate })
      .andWhere('booking.date < :toDate', { toDate })
      .andWhere('booking.storeId = :storeId', { storeId })
      .andWhere('booking.isActive = true')
      .groupBy('MONTH(booking.date), YEAR(booking.date)');
    if (staffId) {
      transactionQuery = transactionQuery.andWhere('staffId = :staffId', { staffId });
    }

    return transactionQuery.getRawMany();
  }

  getReport(_query: QueryReportDto, storeId: number) {
    const { by, start, end, staffId } = _query;

    const todayDate = new Date();
    todayDate.setHours(0);
    todayDate.setMinutes(0);

    const _dateFrom = new Date();
    _dateFrom.setHours(23);
    _dateFrom.setMinutes(0);
    const minInterval = 60;

    _dateFrom.setDate(todayDate.getDate() - minInterval);
    const dateEnd: Date = end ? new Date(`${end}` as string) : todayDate;
    const dateStart: Date = start ? new Date(`${start}` as string) : _dateFrom;
    let transactionQuery = AppointmentBookingEntity.createQueryBuilder('booking')
      .select(`booking.date`, 'date')
      .addSelect('SUM(service.price)', 'total')
      .addSelect('COUNT(booking.id)', 'count')
      .orderBy('date', 'ASC')
      .leftJoin('booking.service', 'service')
      .where('booking.date >= :dateStart', { dateStart })
      .andWhere('booking.date < :dateEnd', { dateEnd })
      .andWhere('booking.storeId = :storeId', { storeId })
      .andWhere('booking.isActive = true');
    if (staffId) {
      transactionQuery = transactionQuery.andWhere('staffId = :staffId', { staffId, });
    }

    switch (by) {
      case 'H':
        transactionQuery = transactionQuery.groupBy('HOUR(booking.date)');
        break;
      case 'D':
        transactionQuery = transactionQuery.groupBy('HOUR(booking.date)');
        break;
      case 'W':
        transactionQuery = transactionQuery.groupBy('DATE(booking.date)');
        break;
      case 'M':
        transactionQuery = transactionQuery.groupBy('WEEK(booking.date)');
        break;
      case '3M':
        transactionQuery = transactionQuery.groupBy('MONTH(booking.date)');
        break;
      case '6M':
        transactionQuery = transactionQuery.groupBy('MONTH(booking.date)');
        break;
      case 'Y':
        transactionQuery = transactionQuery.groupBy('MONTH(booking.date)');
        break;
      default:
        transactionQuery = transactionQuery.groupBy('DATE(booking.date)');
        break;
    }
    return transactionQuery.getRawMany();
  }

  getTotalAppointmentReportDashboard(storeId: number) {
    return BillingEntity.createQueryBuilder("bill")
    .select(["bill.id bill_id", "MONTH(bill.created) as bill_month", "sum(bill.total) sum_month"])
    .where("bill.storeId = :storeId", { storeId })
    .andWhere("YEAR(bill.created) = 2021")
    .groupBy("bill_month")
    .getRawMany()
  }
}
