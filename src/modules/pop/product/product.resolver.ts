import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductEntity } from 'src/entities/Product.entity';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { NewProductInput } from './dto/NewProduct.input';
import { QueryAllProductStoreInput } from './dto/query-all-product-store.input';
import { ReOrderProductsInput } from './dto/ReOrderProducts.input';
import { ProductService } from './product.service';

@Resolver(() => ProductEntity)
@UseGuards(JwtAuthenticationGuard)
export class ProductResolver {
  constructor(private productService: ProductService) { }

  @Query(() => ProductEntity)

  async getAllProductsByStore(@User('storeId') storeId: number, @Args('queryAllProductStoreInput') queryAllProductStoreInput: QueryAllProductStoreInput) {
    return this.productService.getAllProductsByStore(storeId, queryAllProductStoreInput.search, queryAllProductStoreInput.take, queryAllProductStoreInput.skip);
  }

  @Query(() => ProductEntity)
  async getProductsByCategoryId(@Args('id', { type: () => Int }) id: number, @User('storeId') storeId: number,) {
    return this.productService.getProductsByCategoryId(id, storeId);
  }

  @Mutation(() => ProductEntity)
  @UsePipes(new ValidationPipe())
  async newProduct(@Args('newProduct') newProduct: NewProductInput, @User('storeId') storeId: number,) {
    return this.productService.newProduct(newProduct, storeId);
  }

  @Mutation(() => ProductEntity)
  @UsePipes(new ValidationPipe())
  async updateProduct(@Args('updateProduct') updateProduct: NewProductInput, @User('storeId') storeId: number,) {
    return this.productService.newProduct(updateProduct, storeId);
  }

  @Mutation(() => ProductEntity)
  async deleteProduct(@Args('id', { type: () => Int }) id: number, @Args('option', { type: () => String }) _option: string,) {
    return this.productService.deleteProduct(id, _option);
  }

  @Mutation(() => ProductEntity, { name: 'order' })
  @UsePipes(new ValidationPipe())
  async reOrderProducts(@Args('reOrderProducts') reOrderProducts: ReOrderProductsInput,) {
    return this.productService.reOrderProducts(reOrderProducts);
  }

  @Mutation(() => ProductEntity, { name: 'reorder' })
  @UsePipes(new ValidationPipe())
  async updateOrderById(@Args('id', { type: () => Int }) id: number, @Args('orderBy', { type: () => Int }) orderBy: number,) {
    return this.productService.updateOrderById({ id, orderBy });
  }
}
