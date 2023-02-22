import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { CompanyCustomerDto, CustomerDto } from './dto/CompanyCustomer.dto';
import { CompanyCustomerEntity } from 'src/entities/CompanyCustomer.entity';
import { FindCustomerDto } from './dto/FindCustomer.dto';
import { GetCustomerDto } from './dto/GetCustomer.dto';
import { StoreEntity } from 'src/entities/Store.entity';
import { ReviewEntity } from 'src/entities/Review.entity';
import { ConstactUsDto } from './dto/ContactUs.dto';
import { EmailService } from '../email/email.service';
import { AddressEntity } from 'src/entities/Address.entity';
import { CustomerGroupEntity } from 'src/entities/CustomerGroup.entity';
import { ImportCustomerDto } from './dto/ImportCustomer.dto';
import { UpdateCompanyCustomerDto } from './dto/update-comapny-customer.dto';
import { AddStoreDto } from './dto/AddStore.dto';
import { validate } from 'class-validator';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private emailService: EmailService,) { }


  async newCustomer(body: CompanyCustomerDto, companyId: number) {
    const companyCustomer = body as CompanyCustomerEntity;

    const error = await validate(companyCustomer);
    if (error.length > 0) throw new HttpException(`Validation failed!`, HttpStatus.BAD_REQUEST);

    companyCustomer.customer.phoneNumber = companyCustomer.customer.phoneNumber.match(/\d+/g).join('');
    const customer = await CustomerEntity.findOne({ where: { phoneNumber: companyCustomer.customer.phoneNumber } });

    // if (customer) {
    //   companyCustomer.customer = customer;
    // } else {
    //   companyCustomer.customer = await CustomerEntity.save(companyCustomer.customer);
    // }

    companyCustomer.customer = customer ? customer : await CustomerEntity.save(companyCustomer.customer);

    const cCustomer = await CompanyCustomerEntity.findOne({ where: { customerId: companyCustomer.customer.id, companyId } });
    if (cCustomer) {
      cCustomer.customer = companyCustomer.customer
      return cCustomer;
    } else {
      companyCustomer.companyId = companyId;

      if (!companyCustomer.nickname) {
        companyCustomer.nickname = (companyCustomer.customer.firstName || '') + ' ' + (companyCustomer.customer.lastName || '')
      }

      return CompanyCustomerEntity.save(companyCustomer);
    }
  }

  deleteCustomer(companyId: number, id: number) {
    return CompanyCustomerEntity.createQueryBuilder()
      .delete()
      .where("companyId = :companyId", { companyId })
      .andWhere('customerId = :customerId', { customerId: id })
      .execute();
  }

  async importCustomer(body: ImportCustomerDto, companyId: number): Promise<{ status: string }> {
    let customers = body.customer as CustomerEntity[];
    let updateCustomers = [];
    for (let i = 0; i < customers.length; i++) {
      if (!customers[i].phoneNumber) return;
      const customer = await CustomerEntity.findOne({ where: { phoneNumber: customers[i].phoneNumber } });
      const companyCustomer = <CompanyCustomerEntity>{ companyId, nickname: (customers[i].firstName || '') + ' ' + (customers[i].lastName || '') };
      if (customer) {
        customers[i] = customer;
        const cCustomer = await CompanyCustomerEntity.findOne({ where: { customerId: customer.id, companyId } });
        if (!cCustomer) {
          companyCustomer.customerId = customer.id;
          try {
            await CompanyCustomerEntity.save(companyCustomer);
          } catch (err) {
            console.log(err)
          }
        }
      } else {
        const newC = customers[i]
        newC.companyCustomer = [];
        newC.companyCustomer.push(companyCustomer)
        updateCustomers.push(newC);
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

  async getCustomers(_getCustomer: GetCustomerDto, companyId: number) {
    const skip: number = _getCustomer.skip ? +_getCustomer.skip : 0;
    const take: number = _getCustomer.take ? +_getCustomer.take : 10;
    const search: string = _getCustomer.search;

    let cCustomers = await CompanyCustomerEntity.find({ where: { companyId: companyId }, select: ["id", "customerId", "companyId"] });
    let customerIds = cCustomers.map((cCustomer) => cCustomer.customerId)
    let query = CustomerEntity
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.addresses', 'addresses')
      .leftJoinAndSelect('customer.companyCustomer', 'cCustomer')
      .where('customer.id in (:id)', { id: customerIds })
      .take(take)
      .skip(skip);

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

  async getCompanyCustomerByCustomerId(id: number, companyId: number) {
    const customer = await CompanyCustomerEntity.findOne({
      where: { customerId: id, companyId },
      relations: ['customer', 'checkIn', 'rewardClaimeds', 'rewardClaimeds.reward']
    });
    if (!customer) {
      throw new NotFoundException(`not found with id ${id}`)
    }
    customer.customerGroups = await CustomerGroupEntity
      .createQueryBuilder('g')
      .leftJoin('g.companyCustomer', 'c')
      .where('c.id = :id', { id: customer.id })
      .getMany();

    return customer;
  }


  async getCompanyCustomerById(id: number) {
    return CompanyCustomerEntity.findOne({ where: { id: id }, relations: ['customer', 'checkIn', 'customerGroups', 'rewardClaimeds', 'rewardClaimeds.reward'] });

    // console.log(customer)
    // customer.customerGroups = await CustomerGroup
    //     .createQueryBuilder('g')
    //     .leftJoin('g.companyCustomer', 'c')
    //     .where('c.id = :id', { id: id })
    //     .getMany();

    // const checkIn = await CheckIn.find({where: {companyCustomerId: id}, order: { checkInDate: 'DESC'}, take: 10});
    // customer.checkIn = checkIn;
  }

  async getClientCustomer(customerId: number) {
    return await CustomerEntity.findOneBy({ id: customerId });
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

  async updateCompanyCustomer(updateCompanyCustomer: UpdateCompanyCustomerDto) {
    let _companyCustomer = updateCompanyCustomer as CompanyCustomerEntity;
    await CompanyCustomerEntity.save(_companyCustomer);
    return await CustomerEntity.save(_companyCustomer.customer);
  }

  async updateCustomer(updateCustomer: UpdateCustomerDto) {
    const _address = updateCustomer.address as AddressEntity;
    const addressId = updateCustomer.addressId;
    const companyCustomers = updateCustomer.companyCustomers;
    delete updateCustomer.address;
    delete updateCustomer.companyCustomers;
    delete updateCustomer.addressId;

    if (companyCustomers && companyCustomers.length > 0) {
      let companyCustomer = companyCustomers[0];
      const nickname = [updateCustomer.firstName, ' ', updateCustomer.lastName].join('');
      await CompanyCustomerEntity.createQueryBuilder().update({ nickname: nickname }).where("id = :id", { id: companyCustomer.id }).execute()
    }

    if (_address) {
      if (addressId) {
        let updateAddress = { ..._address, customerId: updateCustomer.id }
        AddressEntity.createQueryBuilder().update(updateAddress).where("id = :id", { id: addressId }).execute();
      } else {
        AddressEntity.save(<AddressEntity>{
          address: _address.address,
          address2: _address.address2,
          city: _address.city,
          state: _address.state,
          zipcode: _address.zipcode,
          country: _address.country,
          customerId: updateCustomer.id
        })
      }
    }

    // await CustomerEntity.createQueryBuilder().update(updateCustomer).where("id = :id",{id: updateCustomer.id}).execute()
    return CustomerEntity.save(updateCustomer)
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

  async getFavorStore(customerId: number) {
    const favor = await CustomerEntity.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.favorStores', 'store')
      .addSelect(s => s
        .select('ROUND(AVG(review.rate),1)', 'store_rate')
        .from(ReviewEntity, 'review').where('review.storeId=store.id'), 'store_rate')
      .addSelect(s => s
        .select('COUNT(review.id)', 'review_count')
        .from(ReviewEntity, 'review').where('review.storeId=store.id'), 'store_reviewCount')
      .where('customer.id = :customerId', { customerId })
      .getOne();

    if (!favor) throw new NotFoundException(`not found with id ${customerId}`);

    return favor.favorStores;
  }

  async addFavorStore(body: AddStoreDto, customerId: number) {
    const store = body as StoreEntity;

    const customer = await CustomerEntity.createQueryBuilder('customer')
      .leftJoin('customer.favorStores', 'store')
      .addSelect(['store.id'])
      .where("customer.id = :customerId", { customerId })
      .getOne();
    if (customer) {
      customer.favorStores.push(store);
      await CustomerEntity.save(customer);
    }
  }

  async removeFavorStore(storeId: number, customerId: number) {
    const customer = await CustomerEntity.createQueryBuilder('customer')
      .leftJoin('customer.favorStores', 'store')
      .addSelect(['store.id'])
      .where("customer.id = :customerId", { customerId })
      .getOne();
    if (customer) {
      customer.favorStores = customer.favorStores.filter(store => store.id !== +storeId);
      await CustomerEntity.save(customer);
    }
  }
}
