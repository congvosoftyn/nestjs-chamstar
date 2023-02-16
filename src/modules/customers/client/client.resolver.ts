import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { CustomerFollowingEntity } from 'src/entities/CustomerFollowing.entity';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ClientService } from './client.service';
import { QueryFollowersInput } from './dto/QueryFollowers.input';

@Resolver(() => CustomerFollowingEntity)
// @ApiBearerAuth('customer-token')
@UseGuards(JwtAuthenticationGuard)
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Query(() => CustomerFollowingEntity, { name: 'follower' })
  @UsePipes(new ValidationPipe())
  async getFollowers(@Args('query') query: QueryFollowersInput) {
    return this.clientService.getFollowers(query);
  }

  @Query(() => CustomerFollowingEntity, { name: 'following' })
  @UsePipes(new ValidationPipe())
  async getFollowings(@Args('query') query: QueryFollowersInput) {
    return this.clientService.getFollowings(query);
  }

  @Query(() => CustomerEntity)
  async customerDetail(@Args('id', { type: () => Int }) id: number) {
    return this.clientService.customerDetail(id);
  }
}
