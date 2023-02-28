import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { CustomerDto } from './dto/Customer.dto';
import { FindCustomerDto } from './dto/FindCustomer.dto';
import { GetCustomerDto } from './dto/GetCustomer.dto';
import { ConstactUsDto } from './dto/ContactUs.dto';
import { EmailService } from '../email/email.service';
import { ImportCustomerDto } from './dto/ImportCustomer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private emailService: EmailService,) { }

  async newCustomer(body: CustomerDto, storeId: number) {
    return CustomerEntity.save(<CustomerEntity>{
      phoneNumber: body.phoneNumber,
      countryCode: body.countryCode,
      isoCode: body.isoCode,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      dob: body.dob,
      gender: body.gender,
      avatar: body.avatar,
      storeId: storeId,
      website: body.website,
    })
  }

  deleteCustomer(storeId: number, id: number) {
    return CustomerEntity.createQueryBuilder()
      .delete()
      .where("storeId = :storeId", { storeId })
      .andWhere('id = :customerId', { customerId: id })
      .execute();
  }

  async importCustomer(body: ImportCustomerDto, storeId: number): Promise<{ status: string }> {
    let customers = body.customers as CustomerEntity[];
    // let updateCustomers = [];
    for (let i = 0; i < customers.length; i++) {
      if (!customers[i].phoneNumber) return;
      const customer = await CustomerEntity.findOne({ where: { phoneNumber: customers[i].phoneNumber } });

      if (customer) {
        customers[i] = customer;
      } else {
        const newC = customers[i]
        try {
          await CustomerEntity.save(newC);
        } catch (err) {
          console.log(err)
        }
      }
    }

    return { status: 'ok' };
  }

  async findCustomers(_findCustomer: FindCustomerDto, companyId: number) {
    const skip: number = _findCustomer.pageNumber ? +_findCustomer.pageNumber : 0;
    const take: number = _findCustomer.pageSize ? +_findCustomer.pageSize : 10;
    const sortField: string = _findCustomer.sortField ? _findCustomer.sortField : '';
    const sortOrder = _findCustomer.sortOrder == 'asc' ? 'ASC' : 'DESC';
    const search: string = _findCustomer.filter ? _findCustomer.filter : '';

    let rootQuery = CustomerEntity
      .createQueryBuilder('customer')
      .leftJoin("customer.companyCustomer", "com_customer")
      .where("com_customer.companyId = :companyId", { companyId })

    if (search) {
      rootQuery = rootQuery.andWhere(`(CONCAT(customer.firstName, ' ', customer.lastName) LIKE :keywork OR phoneNumber LIKE :keywork)`, { keywork: `%${search}%` })
    }

    const total = await rootQuery.getCount();
    const query = rootQuery.skip(skip).take(take);

    if (sortField && sortField != 'null') {
      query.orderBy("customer." + sortField, sortOrder)
    }
    const customers = await query.getMany();
    return { items: customers, totalCount: total };
  }

  async getCustomers(_getCustomer: GetCustomerDto, storeId: number) {
    const page: number = _getCustomer.skip ? +_getCustomer.skip : 0;
    const size: number = _getCustomer.take ? +_getCustomer.take : 10;
    const search: string = _getCustomer.search;

    let query = CustomerEntity
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.addresses', 'addresses')
      .where("customer.storeId = :storeId", { storeId })
      .take(size)
      .skip(page * size)

    if (search) {
      query = query.andWhere("(customer.firstName LIKE :keywork OR customer.lastName LIKE :keywork OR customer.phoneNumber LIKE :keywork)", { keywork: `%${search}%` })
        .orderBy('customer.firstName')
    } else {
      query = query.orderBy('cCustomer.created', 'DESC')
    }

    return query.getMany()
  }

  getCustomerById(id: number) {
    return CustomerEntity.findOneOrFail({ where: { id } });
  }

  // async getCompanyCustomerByCustomerId(id: number, companyId: number) {
  //   const customer = await CompanyCustomerEntity.findOne({
  //     where: { customerId: id, companyId },
  //     relations: ['customer', 'checkIn', 'rewardClaimeds', 'rewardClaimeds.reward']
  //   });
  //   if (!customer) {
  //     throw new NotFoundException(`not found with id ${id}`)
  //   }
  //   return customer;
  // }

  async getClientCustomer(customerId: number) {
    return CustomerEntity.findOneBy({ id: customerId });
  }

  async updateFirebaseToken(token: string, customerId: number) {
    const customer = await CustomerEntity.findOneBy({ id: customerId });
    customer.fcmToken = token;
    await customer.save();
    return customer;
  }

  async updateClientCustomer(body: CustomerDto, customerId: number) {
    const _customer = body as CustomerEntity;
    const customer = await CustomerEntity.findOneBy({ id: customerId });
    if (!customer) throw new NotFoundException('No customer found');

    customer.email = _customer.email ? _customer.email.toLowerCase() : null;
    customer.firstName = _customer.firstName ? `${_customer.firstName[0].toUpperCase()}${_customer.firstName.slice(1).toLowerCase()}` : null;
    customer.lastName = _customer.lastName ? `${_customer.lastName[0].toUpperCase()}${_customer.lastName.slice(1).toLowerCase()}` : null;


    return await customer.save();
  }

  // async updateCompanyCustomer(customer: UpdateCustomerDto, storeId: number) {
  //   let _customer = customer as CustomerEntity;
  //   _customer.storeId = storeId;
  //   return CustomerEntity.save(_customer);
  // }

  async updateCustomer(customer: UpdateCustomerDto,storeId: number) {
    let _customer = customer as CustomerEntity;
      _customer.storeId = storeId;
      return CustomerEntity.save(_customer);
  }

  async contactUs(body: ConstactUsDto, customerId: number) {
    this.emailService.sendContactUsEmail("thanh@solutrons.com", "Message from " + body.name, `
            From: ${body.email}\n
            Name: ${body.name}\n
            CustomerId: ${customerId}
            Message: ${body.message}\n
        `);

    return { succeed: true };
  }
}
