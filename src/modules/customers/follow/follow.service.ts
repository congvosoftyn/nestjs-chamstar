import { Injectable } from '@nestjs/common';
import { CustomerFollowingEntity } from 'src/entities/CustomerFollowing.entity';
import { CustomersService } from '../customers.service';
import { FollowerListDto } from './dto/FollowerList.dto';

@Injectable()
export class FollowService {
  constructor(private customersService: CustomersService) {}

  async isFollowing(followingId: number, customerId: number) {
    return await CustomerFollowingEntity.findOne({
      where: { customerId, followingId },
    });
  }

  async updateFollowing(followingId: number, customerId: number) {
    return await this.customersService.followCustomer(customerId, followingId);
  }

  async unfollowing(followingId: number, customerId: number) {
    return await this.customersService.unfollowCustomer(
      customerId,
      followingId,
    );
  }

  async followingList(_followerList: FollowerListDto) {
    const { customerId, take, skip } = _followerList;
    return await this.customersService.getFollowingList(
      +customerId,
      +take,
      +skip,
    );
  }

  async followerList(_followerList: FollowerListDto) {
    const { customerId, take, skip } = _followerList;

    return await this.customersService.getFollowerList(
      +customerId,
      +take,
      +skip,
    );
  }
}
