import { UseGuards } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { AppointmentActivityEntity } from 'src/entities/AppointmentActivity.entity';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ActivityService } from './activity.service';
import { DeleteDto } from './dto/deletel.dto';
import { UnreadObjectType } from './dto/unread.objectype';

@Resolver(() => AppointmentActivityEntity)
@UseGuards(JwtAuthenticationGuard)
export class ActiveResolver {
  constructor(private readonly activityService: ActivityService) { }

  @Query(() => [AppointmentActivityEntity])
  async getActivity(@Args('page', { type: () => Int }) page: number, @User('storeId') storeId: number,) {
    return this.activityService.getActivity(page, storeId);
  }

  @Query(() => UnreadObjectType, { name: 'unread' })
  async unread(@User('storeId') storeId: number) {
    return this.activityService.unread(storeId);
  }

  @Query(() => DeleteDto, { name: 'readall' })
  async readall(@User('storeId') storeId: number) {
    return this.activityService.readall(storeId);
  }

  @Query(() => DeleteDto)
  async deleteAppointmentActivity(@Args('id', { type: () => Int }) id: number) {
    return this.activityService.delete(id);
  }
}
