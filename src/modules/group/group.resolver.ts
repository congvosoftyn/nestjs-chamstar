import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CustomerGroupEntity } from 'src/entities/CustomerGroup.entity';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { User } from '../user/decorators/user.decorator';
import { AddCustomerGroupInput } from './dto/AddCustomerGroup.input';
import { AddGroupInput } from './dto/AddGroup.input';
import { GroupService } from './group.service';

@Resolver(() => CustomerGroupEntity)
@UseGuards(JwtAuthenticationGuard)
export class GroupResolver {
  constructor(private groupService: GroupService) {}

  //   @ApiBearerAuth('access-token')
  @Mutation(() => CustomerGroupEntity)
  @UsePipes(new ValidationPipe())
  async addGroup(
    @Args('body') body: AddGroupInput,
    @User('companyId') companyId: number,
  ) {
    return this.groupService.addGroup(body, companyId);
  }

  //   @ApiBearerAuth('access-token')
  @Query(() => CustomerGroupEntity)
  async getGroups(@User('companyId') companyId: number) {
    return this.groupService.getGroups(companyId);
  }

  //   @ApiBearerAuth('access-token')
  @Query(() => CustomerGroupEntity, { name: 'groupforPromo' })
  async getGroupForPromo(
    @User('companyId') companyId: number,
    @User('storeId') storeId: number,
  ) {
    return this.groupService.getGroupForPromo(companyId, storeId);
  }

  //   @ApiBearerAuth('access-token')
  @Mutation(() => CustomerGroupEntity)
  async deleteGroup(@Args('id', { type: () => Int }) id: number) {
    return this.groupService.deleteGroup(id);
  }

  //   @ApiBearerAuth('access-token')
  @Mutation(() => CustomerGroupEntity, { name: 'addCustomer' })
  async addCustomerGroup(
    @Args('addCustomerGroup') addCustomerGroup: AddCustomerGroupInput,
  ) {
    return this.groupService.addCustomerGroup(addCustomerGroup);
  }

  //   @ApiBearerAuth('access-token')
  @Mutation(() => CustomerGroupEntity, { name: 'removeCustomer' })
  @UsePipes(new ValidationPipe())
  async removeCustomerGroup(
    @Args('body') body: AddGroupInput,
    @Args('customerId', { type: () => Int }) customerId: number,
    @Args('groupId', { type: () => Int }) groupId: number,
  ) {
    return this.groupService.removeCustomerGroup(customerId, groupId, body);
  }
}
