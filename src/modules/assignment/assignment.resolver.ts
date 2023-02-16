import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AssignEntity } from 'src/entities/Assign.entity';
import { AssignmentEntity } from 'src/entities/Assignment.entity';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { User } from '../user/decorators/user.decorator';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentInput } from './dto/create-assignment.input';
import { CreateAssignInput } from './dto/CreateAssign.input';

@Resolver(() => AssignmentEntity)
@UseGuards(JwtAuthenticationGuard)
export class AssignmentResolver {
  constructor(private assignmentService: AssignmentService) {}

  //   @ApiBearerAuth('access-token')
  @Query(() => AssignmentEntity)
  async getAssigns(@User('storeId') storeId: number) {
    return this.assignmentService.getAssigns(storeId);
  }

  //   @ApiBearerAuth('access-token')
  @Mutation(() => AssignEntity)
  @UsePipes(new ValidationPipe())
  async createAssign(
    @Args('createAssignInput') createAssignInput: CreateAssignInput,
    @User('storeId') storeId: number,
  ) {
    return this.assignmentService.createAssign(createAssignInput, storeId);
  }

  //   @ApiBearerAuth('access-token')
  @Mutation(() => AssignEntity)
  @UsePipes(new ValidationPipe())
  async updateAssign(
    @Args('createAssignInput') createAssignInput: CreateAssignInput,
  ) {
    return this.assignmentService.updateAssign(createAssignInput);
  }

  //   @Delete('/:id')
  //   @ApiBearerAuth('access-token')
  @Mutation(() => AssignmentEntity)
  async deleteAssign(@Args('id', { type: () => Int }) id: number) {
    return this.assignmentService.deleteAssign(id);
  }

  //   //Assignment
  //   @ApiBearerAuth('access-token')
  @Mutation(() => AssignmentEntity, { name: 'assignment' })
  @UsePipes(new ValidationPipe())
  async createAssignment(
    @Args('createAssignmentInput') createAssignmentInput: CreateAssignmentInput,
  ) {
    return this.assignmentService.createAssignment(
      createAssignmentInput as AssignmentEntity,
    );
  }
}
