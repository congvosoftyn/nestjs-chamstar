import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppointmentLabelEntity } from 'src/entities/AppointmentLabel.entity';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { CreateLabelInput } from './dto/create-label.input';
import { LabelService } from './label.service';

@Resolver(() => AppointmentLabelEntity)
@UseGuards(JwtAuthenticationGuard)
export class LabelResolver {
  constructor(private readonly labelService: LabelService) { }

  @Query(() => [AppointmentLabelEntity])
  async getLabels(@User('storeId') storeId: number) {
    return this.labelService.getLabels(storeId);
  }

  @Mutation(() => AppointmentLabelEntity)
  @UsePipes(new ValidationPipe())
  async createLabel(@Args('updateLabelInput') updateLabelInput: CreateLabelInput, @User('storeId') storeId: number,) {
    return this.labelService.createLabel(updateLabelInput, storeId,);
  }

  @Mutation(() => AppointmentLabelEntity)
  @UsePipes(new ValidationPipe())
  async updateLabel(@Args('id', { type: () => Int }) id: number, @Args('updateLabelInput') updateLabelInput: CreateLabelInput, @User('storeId') storeId: number,) {
    return this.labelService.updateLabel(id, updateLabelInput, storeId,);
  }

  @Mutation(() => AppointmentLabelEntity)
  async deleteLabel(@Args('id', { type: () => Int }) id: number, @User('storeId') storeId: number,) {
    return this.labelService.deleteLabel(id, storeId);
  }
}
