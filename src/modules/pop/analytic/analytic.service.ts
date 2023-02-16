import { Injectable } from '@nestjs/common';
import { CheckInEntity } from 'src/entities/CheckIn.entity';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { SaleTransactionEntity } from 'src/entities/SaleTransaction.entity';

@Injectable()
export class AnalyticService {
  async getStoreDashboard(companyId: number, storeId: number) {
    const totalCustomers = await CustomerEntity.createQueryBuilder('customer')
      .leftJoin('customer.companyCustomer', 'cCustomer')
      .where('cCustomer.companyId = :companyId', { companyId })
      .getCount();

    const totalCheckins = await CheckInEntity.createQueryBuilder('checkin')
      .where('checkin.companyCustomerId = :companyId', { companyId })
      .getCount();

    const sales = await SaleTransactionEntity.createQueryBuilder('sale')
      .leftJoin('sale.register', 'register')
      .leftJoinAndSelect('sale.customer', 'customer')
      .leftJoinAndSelect('sale.products', 'products')
      .leftJoinAndSelect('sale.payments', 'payments')
      .leftJoinAndSelect('sale.assign', 'assign')
      .leftJoinAndSelect('products.product', 'product')
      .leftJoinAndSelect('products.productOption', 'productOption')
      .leftJoinAndSelect('products.modifierOptions', 'modifierOptions')
      .leftJoinAndSelect('products.taxes', 'taxes')
      .leftJoinAndSelect('products.discounts', 'discounts')
      .leftJoinAndSelect('products.saleGiftCard', 'giftCards')
      .where('register.storeId = :storeId', { storeId })
      .orderBy('sale.created', 'DESC')
      .getMany();

    let totalSales = 0;
    sales.map((sale) => (totalSales += sale.calculateSubTotal()));
    return { totalSales, totalCustomers, totalCheckins };
  }
}
