import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EmployeeEntity } from 'src/entities/Employee.entity';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { User } from '../user/decorators/user.decorator';
import { NewEmployeeInput } from './dto/NewEmployee.input';
import { EmployeeService } from './employee.service';

@Resolver(() => EmployeeEntity)
@UseGuards(JwtAuthenticationGuard)
export class EmployeeResolver {
  constructor(private employeeService: EmployeeService) {}

  //   @ApiBearerAuth('access-token')
  @Mutation(() => EmployeeEntity)
  @UsePipes(new ValidationPipe())
  async newEmployee(
    @Args('newEmployee') newEmployee: NewEmployeeInput,
    @User('storeId') storeId: number,
  ) {
    return this.employeeService.newEmployee(newEmployee, storeId);
  }

  //   @ApiBearerAuth('access-token')
  @Mutation(() => EmployeeEntity)
  async deleteEmployee(@Args('id', { type: () => Number }) id: number) {
    return this.employeeService.deleteEmployee(id);
  }

  //   @ApiBearerAuth('access-token')
  @Query(() => EmployeeEntity)
  async getAllEmployee(@User('storeId') storeId: number) {
    return this.employeeService.getAllEmployee(storeId);
  }
}
