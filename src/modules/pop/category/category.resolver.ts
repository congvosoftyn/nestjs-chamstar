import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductCategoryEntity } from 'src/entities/ProductCategory.entity';
import { GetServiceInput } from 'src/modules/appointment/service/dto/get-service.input';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { CategoryService } from './category.service';
import { NewCategoryInput } from './dto/NewCategory.input';

@Resolver(() => ProductCategoryEntity)
@UseGuards(JwtAuthenticationGuard)
export class CategoryResolver {
  constructor(private categoryService: CategoryService) { }

  @Query(() => ProductCategoryEntity)
  async getAllCategoriesByStore(@User('storeId') storeId: number, @Args('getServiceInput') getServiceInput: GetServiceInput) {
    return this.categoryService.getAllCategoriesByStore(storeId, getServiceInput.search);
  }

  @Query(() => ProductCategoryEntity, { name: 'cart' })
  async getAllCategoriesForCart(@User('storeId') storeId: number) {
    return this.categoryService.getAllCategoriesForCart(storeId);
  }

  @Mutation(() => ProductCategoryEntity)
  @UsePipes(new ValidationPipe())
  async newCategory(@Args('body') body: NewCategoryInput, @User('storeId') storeId: number,) {
    return this.categoryService.newCategory(body, storeId);
  }

  @Mutation(() => ProductCategoryEntity)
  @UsePipes(new ValidationPipe())
  async updateCategory(@Args('body') body: NewCategoryInput, @User('storeId') storeId: number,) {
    return this.categoryService.newCategory(body, storeId);
  }

  @Query(() => ProductCategoryEntity)
  async getCategory(@Args('id', { type: () => Int }) id: number) {
    return this.categoryService.getCategory(id);
  }
}
