import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class QueryReportInput {
  @Field(() => String)
  by: string;
  @Field(() => Date)
  start: Date;
  @Field(() => Date)
  end: Date;
  @Field(() => String)
  staffId: string;
}
