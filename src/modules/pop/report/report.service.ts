import { Injectable } from '@nestjs/common';
import { PaymentTransactionEntity } from 'src/entities/PaymentTransaction.entity';
import { QueryGetReportDto } from './dto/QueryGetReport.dto';

@Injectable()
export class ReportService {
    async getReport(_queryGetReportDto: QueryGetReportDto, storeId: number) {
        const { by, registerId, start, end } = _queryGetReportDto;
        let todayDate = new Date();
        todayDate.setHours(0);
        todayDate.setMinutes(0);

        let _dateFrom = new Date();
        _dateFrom.setHours(23);
        _dateFrom.setMinutes(0);
        let minInterval = 60;
        switch (by) {
            case 'H':
                minInterval = 60;
                break;
            case 'D':
                minInterval = 60;
                break;
            case 'W':
                minInterval = 60 * 24;
                break;
            case 'M':
                minInterval = 60 * 24 * 7;
                break;
            case '3M':
                minInterval = 60 * 24 * 7;
                break;
            case '6M':
                minInterval = 60 * 24 * 30;
                break;
            case 'Y':
                minInterval = 60 * 24 * 30;
                break;
            default:
                minInterval = 60;
                break;
        }
        _dateFrom.setDate(todayDate.getDate() - minInterval)
        let dateEnd: Date = end ? new Date(end as string) : todayDate;
        let dateStart: Date = start ? new Date(start as string) : _dateFrom;
        let transactionQuery = PaymentTransactionEntity.createQueryBuilder('transaction')
            .select(`SUM(transaction.tip) as tip, transaction.payment_method, from_unixtime(FLOOR(UNIX_TIMESTAMP(transaction.created)/(${minInterval}*60))*(${minInterval}*60)) AS date , SUM(transaction.amount) total`)
            .groupBy('date')
            .leftJoin('sale_transaction', 'sale', 'sale.id = transaction.saleTransactionId')
            .leftJoin('register', 'register', 'register.id=sale.registerId')
            .where(`transaction.created >= '${dateStart.toISOString()}'`)
            .andWhere(`transaction.created < '${dateEnd.toISOString()}'`);
        if (registerId) {
            transactionQuery = transactionQuery.andWhere(`register.deviceId = '${registerId}'`);
        } else {
            transactionQuery = transactionQuery.andWhere(`register.storeId = '${storeId}'`);
        }

        return await transactionQuery.getRawMany();
    }

    async getTransaction(storeId: number) {
        const _7day = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return await PaymentTransactionEntity
            .createQueryBuilder('tran')
            .leftJoinAndSelect('tran.saleTransaction', 'sale')
            .leftJoin('sale.register', 'register', 'register.storeId = :storeId', { storeId })
            .leftJoinAndSelect('sale.customer', 'customer')
            .leftJoinAndSelect('sale.products', 'products')
            .leftJoinAndSelect('sale.assign', 'assign')
            .leftJoinAndSelect('products.product', 'product')
            .leftJoinAndSelect('products.productOption', 'productOption')
            .leftJoinAndSelect('products.modifierOptions', 'modifierOptions')
            .leftJoinAndSelect('products.taxes', 'taxes')
            .leftJoinAndSelect('products.discounts', 'discounts')
            .leftJoinAndSelect('products.saleGiftCard', 'giftCards')
            .where('tran.created > :days', { days: _7day })
            .orderBy('tran.created', 'DESC')
            .getMany();
    }
}
