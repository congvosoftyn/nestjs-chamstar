import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CustomerFollowingEntity } from 'src/entities/CustomerFollowing.entity';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import JwtCustomerAuthGuard from 'src/shared/guards/jwtCustomerAuth.guard';
import { FollowerListInput } from './dto/FollowerList.input';
import { FollowService } from './follow.service';

@Resolver(() => CustomerFollowingEntity)
@UseGuards(JwtCustomerAuthGuard)
export class FollowResolver {
  constructor(private readonly followService: FollowService) { }

  @Query(() => CustomerFollowingEntity, { name: 'follower' })
  @UsePipes(new ValidationPipe())
  async followerList(@Args('_followerList') _followerList: FollowerListInput) {
    return this.followService.followerList(_followerList);
  }

  @Query(() => CustomerFollowingEntity, { name: 'following' })
  @UsePipes(new ValidationPipe())
  async followingList(@Args('_followerList') _followerList: FollowerListInput) {
    return this.followService.followingList(_followerList);
  }

  @Query(() => CustomerFollowingEntity, { name: 'is_following' })
  async isFollowing(@Args('followingId', { type: () => Int }) followingId: number, @User('customerId') customerId: number,) {
    return this.followService.isFollowing(followingId, customerId);
  }

  @Mutation(() => CustomerFollowingEntity, { name: 'follow' })
  async updateFollowing(@Args('followingId', { type: () => Int }) followingId: number, @User('customerId') customerId: number,) {
    return this.followService.updateFollowing(followingId, customerId);
  }

  @Mutation(() => CustomerFollowingEntity, { name: 'unfollow' })
  async unfollow(@Args('followingId', { type: () => Int }) followingId: number, @User('customerId') customerId: number,) {
    return this.followService.updateFollowing(followingId, customerId);
  }

  @Mutation(() => CustomerFollowingEntity, { name: 'view' })
  async unfollowing(@Args('followingId', { type: () => Int }) followingId: number, @User('customerId') customerId: number,) {
    return this.followService.unfollowing(followingId, customerId);
  }
}
