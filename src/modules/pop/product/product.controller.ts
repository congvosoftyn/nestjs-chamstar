import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { NewProductDto } from './dto/NewProduct.dto';
import { QueryAllProductStoreDto } from './dto/query-all-product-store.dto';
import { ReOrderProductsDto } from './dto/ReOrderProducts.dto';
import { UpdateOrderByIdDto } from './dto/UpdateOrderById.dto';
import { ProductService } from './product.service';

@Controller('pop/product')
@ApiTags('pop/product')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class ProductController {
    constructor(private productService: ProductService) { }

    @Get()
    async getAllProductsByStore(@User('storeId') storeId: number, @Query() { search, size, page }: QueryAllProductStoreDto) {
        return this.productService.getAllProductsByStore(storeId, search, size, page);
    }

    @Get('/:id')
    async getProductsByCategoryId(@Param('id') id: number, @User('storeId') storeId: number) {
        return this.productService.getProductsByCategoryId(id, storeId);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async newProduct(@Body() body: NewProductDto, @User('storeId') storeId: number) {
        return this.productService.newProduct(body, storeId);
    }

    @Put('/:id')
    @UsePipes(new ValidationPipe())
    updateProduct(@Param("id") id: number, @Body() body: NewProductDto, @User('storeId') storeId: number) {
        return this.productService.updateProduct(id, body, storeId);
    }

    @Delete('/:id')
    async deleteProduct(@Param('id') id: number, @Query('option') _option: string) {
        return this.productService.deleteProduct(id, _option);
    }

    @Put('/order')
    @UsePipes(new ValidationPipe())
    async reOrderProducts(@Body() body: ReOrderProductsDto) {
        return this.productService.reOrderProducts(body);
    }

    @Put('/reorder')
    @UsePipes(new ValidationPipe())
    async updateOrderById(@Body() body: UpdateOrderByIdDto) {
        return this.productService.updateOrderById(body);
    }

}
