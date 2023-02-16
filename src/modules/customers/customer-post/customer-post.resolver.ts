import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CustomerPostEntity } from 'src/entities/CustomerPost.entity';
import { UserCustomer } from 'src/modules/user/decorators/user-customer.decorator';
import JwtCustomerAuthGuard from 'src/shared/guards/jwtCustomerAuth.guard';
import { CustomerPostService } from './customer-post.service';
import { NewPostInput } from './dto/NewPost.input';
import { QueryPostsInput } from './dto/QueryPosts.input';

@Resolver(() => CustomerPostEntity)
@UseGuards(JwtCustomerAuthGuard)
export class CustomerPostResolver {
  constructor(private readonly customerPostService: CustomerPostService) { }

  @Mutation(() => CustomerPostEntity)
  @UsePipes(new ValidationPipe())
  async newPost(@Args('body') body: NewPostInput, @UserCustomer('companyId') companyId: number,) {
    return this.customerPostService.newPost(body, companyId);
  }

  @Mutation(() => CustomerPostEntity, { name: 'like' })
  @UsePipes(new ValidationPipe())
  async likePost(@Args('isLike', { type: () => Boolean }) isLike: boolean = true, @Args('postId', { type: () => Int }) postId: number, @UserCustomer('companyId') companyId: number,) {
    return this.customerPostService.likePost(postId, isLike, companyId);
  }

  @Mutation(() => CustomerPostEntity, { name: 'view' })
  async viewPost(@Args('postId', { type: () => Int }) postId: number) {
    return this.customerPostService.viewPost(postId);
  }

  @Query(() => CustomerPostEntity, { name: 'calendar_slots' })
  @UsePipes(new ValidationPipe())
  async getPosts(@Args('query') query: QueryPostsInput, @UserCustomer('customerId') customerId: number,) {
    return this.customerPostService.getPosts(query.take, query.skip, query.fromCustomerId, customerId,);
  }
}
