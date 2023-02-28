import { Injectable } from '@nestjs/common';
import { CustomerEntity } from 'src/entities/Customer.entity';

@Injectable()
export class CustomersService {
  async getCustomerInfo(customerId: number) {
    return await CustomerEntity.findOneBy({ id: customerId });
  }


  async saveCustomerSocketId(customerId: number, socketId: string) {
    return  CustomerEntity.update(customerId, { socketId });
  }

  async getCustomerSocketId(toCustomerId: number) {
    return  CustomerEntity.createQueryBuilder()
      .select('socketId')
      .where({ id: toCustomerId })
      .getOne();
  }
 
  async fuzzyMatchUsers(search: string) {
    const query = CustomerEntity.createQueryBuilder('customer')
      .where(`(CONCAT(customer.firstName, ' ', customer.lastName) LIKE :keywork)`, { keywork: `%${search}%` }).take(10).getMany();
  }

}
