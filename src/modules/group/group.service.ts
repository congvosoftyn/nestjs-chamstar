import { Injectable } from '@nestjs/common';
import { CheckInEntity } from 'src/entities/CheckIn.entity';
import { CompanyCustomerEntity } from 'src/entities/CompanyCustomer.entity';
import { CustomerGroupEntity } from 'src/entities/CustomerGroup.entity';
import { AddCustomerGroupDto } from './dto/AddCustomerGroup.dto';
import { AddGroupDto } from './dto/AddGroup.dto';

@Injectable()
export class GroupService {
  getGroups(companyId: number) {
    return CustomerGroupEntity.createQueryBuilder('g')
      .where({ companyId: companyId })
      .loadRelationCountAndMap('g.customerCount', 'g.companyCustomer')
      .getMany();
  }

  async getGroupForPromo(companyId: number, storeId: number) {
    const groups = [];

    //All customer
    groups.push({
      customerCount: await CompanyCustomerEntity.getRepository()
        .createQueryBuilder()
        .where({ companyId: companyId })
        .getCount(),
      id: 0,
      icon: '',
      companyId: companyId,
      name: 'All',
    });
    // Store customer
    groups.push({
      customerCount: await CompanyCustomerEntity.getRepository()
        .createQueryBuilder('companyCustomer')
        .leftJoin('companyCustomer.checkIn', 'checkIn')
        .where({ companyId: companyId })
        .andWhere('checkIn.storeId=' + storeId)
        .getCount(),
      id: -1,
      icon: '',
      companyId: companyId,
      name: 'Current Store',
    });

    //Customer
    const newCustomers = await CheckInEntity.createQueryBuilder()
      .where({ storeId: storeId })
      .having('COUNT(companyCustomerId)=1')
      .groupBy('companyCustomerId')
      .getMany();

    groups.push({
      customerCount:
        newCustomers && newCustomers.length ? newCustomers.length : 0,
      id: -2,
      icon: '',
      companyId: companyId,
      name: 'New',
    });

    //Regular group
    const regularCustomers = await CheckInEntity.createQueryBuilder()
      .where({ storeId: storeId })
      .having('COUNT(companyCustomerId)>1')
      .groupBy('companyCustomerId')
      .getMany();

    groups.push({
      customerCount:
        regularCustomers && regularCustomers.length
          ? regularCustomers.length
          : 0,
      id: -3,
      icon: '',
      companyId: companyId,
      name: 'Regular',
    });

    const otherGroups = await CustomerGroupEntity.createQueryBuilder('g')
      .where({ companyId: companyId })
      .loadRelationCountAndMap('g.customerCount', 'g.companyCustomer')
      .getMany();

    otherGroups.forEach((v) => {
      groups.push(v);
    });
    // 0 - all, -1 - current store,  -2 new customers, -3 regular
    return groups;
  }

  async addGroup(body: AddGroupDto, companyId: number) {
    const group = body as CustomerGroupEntity;
    group.companyId = companyId;
    await CustomerGroupEntity.save(group);
    return group;
  }

  async deleteGroup(groupId: number) {
    return await CustomerGroupEntity.delete(groupId);
  }

  async addCustomerGroup(_addCustomerGroup: AddCustomerGroupDto) {
    const group = _addCustomerGroup.group as CustomerGroupEntity;

    // const customer = await CompanyCustomer.findOne({id: customerId});
    await CustomerGroupEntity.createQueryBuilder()
      .relation(CustomerGroupEntity, 'companyCustomer')
      .of(group.id)
      .add(_addCustomerGroup.customerId);
    // await CustomerGroupEntity.save({id: group.id, companyCustomer: {id:customerId}})
    return group;
  }

  async removeCustomerGroup(
    customerId: number,
    groupId: number,
    body: AddGroupDto,
  ) {
    await CustomerGroupEntity.createQueryBuilder()
      .relation(CustomerGroupEntity, 'companyCustomer')
      .of(groupId)
      .remove(customerId);

    return body;
  }
}
