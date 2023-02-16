import { Injectable } from '@nestjs/common';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { CustomerFollowingEntity } from 'src/entities/CustomerFollowing.entity';
import { QueryFollowersDto } from './dto/QueryFollowers.dto';

@Injectable()
export class ClientService {
  async customerDetail(id: number) {
    return await CustomerEntity.createQueryBuilder('c')
      .addSelect([
        'c.firstName',
        'c.id',
        'c.lastName',
        'c.avatar',
        'c.description',
        'c.facebook',
        'c.instagram',
        'c.twitter',
        'c.pinterest',
        'c.website',
      ])
      .addSelect(
        (s) =>
          s
            .select('COUNT(*)')
            .from(CustomerFollowingEntity, 'f')
            .where('f.customerId = c.id'),
        'c_following',
      )
      .addSelect(
        (s) =>
          s
            .select('COUNT(*)')
            .from(CustomerFollowingEntity, 'f')
            .where('f.followingId = c.id'),
        'c_follower',
      )
      //isfollowing     .addSelect(`exists (${CustomerFollowing.createQueryBuilder('fff').select('fff.id').where("fff.followingId = following.id AND fff.customerId = c.id").getQuery()})`, 'c_isFollowing')
      .leftJoinAndSelect('c.address', 'address')
      .where('c.id = :customerId', { customerId: id })
      .getOne();
  }

  async getFollowers(query: QueryFollowersDto) {
    const { customerId, take, skip } = query;
    return await CustomerFollowingEntity.createQueryBuilder('f')
      .select('c.firstName, c.lastName, c.avatar, c.id')
      .addSelect(
        (s) =>
          s
            .select('COUNT(*)')
            .from(CustomerFollowingEntity, 'ff')
            .where('ff.followingId=c.id'),
        'followers',
      )
      .addSelect(
        `exists (${CustomerFollowingEntity.createQueryBuilder('fff')
          .select('fff.id')
          .where('fff.followingId=c.id AND fff.customerId = ' + customerId)
          .getQuery()})`,
        'isFollowing',
      )
      .leftJoin('f.customer', 'c')
      .where('f.followingId = :customerId', { customerId })
      .take(take)
      .skip(skip)
      .orderBy('f.created', 'DESC')
      .getRawMany();
  }

  async getFollowings(query: QueryFollowersDto) {
    const { customerId, take, skip } = query;
    return await CustomerFollowingEntity.createQueryBuilder('f')
      .select(
        'following.firstName, following.lastName, following.avatar, following.id',
      )
      .addSelect(
        (s) =>
          s
            .select('COUNT(ff.followingId)')
            .from(CustomerFollowingEntity, 'ff')
            .where('ff.followingId=following.id'),
        'followers',
      )
      .addSelect(
        `exists (${CustomerFollowingEntity.createQueryBuilder('fff')
          .select('fff.id')
          .where('fff.followingId = following.id AND fff.customerId = c.id')
          .getQuery()})`,
        'isFollowing',
      )
      .leftJoin('f.customer', 'c')
      .leftJoin('f.following', 'following')
      .where('f.customerId = :customerId', { customerId })
      .take(take)
      .skip(skip)
      .orderBy('f.created', 'DESC')
      .getRawMany();
  }
}
