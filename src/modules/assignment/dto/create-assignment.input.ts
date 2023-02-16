import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { AssignmentEntity } from 'src/entities/Assignment.entity';

@InputType()
export class CreateAssignmentInput extends PartialType(AssignmentEntity) {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  assignId: number;

  @Field(() => Int)
  waitlistId: number;

  @Field(() => Int)
  customerId: number;

  @Field(() => Date)
  timeIn: Date;

  @Field(() => Date, { nullable: true })
  timeOut: Date;
}
