import { Injectable } from '@nestjs/common';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { CustomerFollowingEntity } from 'src/entities/CustomerFollowing.entity';

@Injectable()
export class CustomersService {
  async getCustomerInfo(customerId: number) {
    return await CustomerEntity.findOneBy({ id: customerId });
  }

  async getCustomerForDetailPage(customerId: number) {
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
      .where('c.id = :customerId', { customerId })
      .getOne();
  }

  async saveCustomerSocketId(customerId: number, socketId: string) {
    return await CustomerEntity.update(customerId, { socketId });
  }

  async getCustomerSocketId(toCustomerId: number) {
    return await CustomerEntity.createQueryBuilder()
      .select('socketId')
      .where({ id: toCustomerId })
      .getOne();
  }

  async getPrivateList(customerId: number) {
    return await CustomerFollowingEntity.createQueryBuilder('f')
      .select('f.customerId, c.firstName, c.lastName, c.avatar, f.created')
      .addSelect(
        (s) =>
          s
            .select('p.message')
            .from('private_chat', 'p')
            .where(
              '(p.fromCustomerId = f.followingId AND p.toCustomerId = f.customerId) OR (p.fromCustomerId = f.customerId AND p.toCustomerId = f.followingId)',
            ),
        'message',
      )
      .addSelect(
        (s) =>
          s
            .select('p.created')
            .from('private_chat', 'p')
            .where(
              '(p.fromCustomerId = f.followingId AND p.toCustomerId = f.customerId) OR (p.fromCustomerId = f.customerId AND p.toCustomerId = f.followingId)',
            ),
        'created',
      )
      .addSelect(
        (s) =>
          s
            .select('p.attachments')
            .from('private_chat', 'p')
            .where(
              '(p.fromCustomerId = f.followingId AND p.toCustomerId = f.customerId) OR (p.fromCustomerId = f.customerId AND p.toCustomerId = f.followingId)',
            ),
        'attachments',
      )
      .innerJoin('f.follower', 'c')
      .where('f.followingId = :customerId', { customerId })
      .getRawMany();

    // const _sql = ` SELECT r.from_user as user_id, i.name, i.avatar, i.github_id, r.time as be_friend_time,
    //   (SELECT p.message FROM private_msg AS p WHERE (p.to_user = r.from_user and p.from_user = r.user_id) or (p.from_user = r.from_user and p.to_user = r.user_id) ORDER BY p.time DESC   LIMIT 1 )  AS message ,
    //   (SELECT p.time FROM private_msg AS p WHERE (p.to_user = r.from_user and p.from_user = r.user_id) or (p.from_user = r.from_user and p.to_user = r.user_id) ORDER BY p.time DESC   LIMIT 1 )  AS time,
    //   (SELECT p.attachments FROM private_msg AS p WHERE (p.to_user = r.from_user and p.from_user = r.user_id) or (p.from_user = r.from_user and p.to_user = r.user_id) ORDER BY p.time DESC   LIMIT 1 )  AS attachments
    //   FROM  user_user_relation AS r inner join user_info AS i on r.from_user  = i.id WHERE r.user_id = ? ;`;
  }

  async fuzzyMatchUsers(search: string) {
    const query = CustomerEntity.createQueryBuilder('customer')
      .where(`(CONCAT(customer.firstName, ' ', customer.lastName) LIKE :keywork)`, { keywork: `%${search}%` }).take(10).getMany();
  }

  async followCustomer(customerId: number, followingId: number) {
    const follow = new CustomerFollowingEntity();
    follow.customerId = customerId;
    follow.followingId = followingId;
    return await follow.save();
  }

  async unfollowCustomer(customerId: number, followingId: number) {
    return await CustomerFollowingEntity.createQueryBuilder()
      .delete()
      .where('followingId = :followingId and customerId = :customerId', {
        followingId,
        customerId,
      })
      .execute();
  }

  async getFollowingList(customerId: number, take: number, skip: number) {
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

  async getFollowerList(customerId: number, take: number, skip: number) {
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
}
