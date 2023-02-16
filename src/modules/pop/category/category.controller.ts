import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetServiceDto } from 'src/modules/appointment/service/dto/get-service.dto';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { CategoryService } from './category.service';
import { NewCategoryDto } from './dto/NewCategory.dto';
import { QueryServiceByCategoryDto } from './dto/query-service-by-category.dto';
import { UpdateServicesByCategoryDto } from './dto/update-service-by-categories.dto';

@Controller('pop/category')
@ApiTags('pop/category')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    @Get()
    async getAllCategoriesByStore(@User('storeId') storeId: number, @Query() { search }: GetServiceDto) {
        return this.categoryService.getAllCategoriesByStore(storeId, search);
    }

    @Get('/cart')
    async getAllCategoriesForCart(@User('storeId') storeId: number) {
        return this.categoryService.getAllCategoriesForCart(storeId);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async newCategory(@Body() body: NewCategoryDto, @User('storeId') storeId: number) {
        return this.categoryService.newCategory(body, storeId);
    }

    @Put('/:id')
    updateCategory(@Param('id') id: number, @Body() body: NewCategoryDto) {
        return this.categoryService.updateCategory(id, body);
    }

    @Get('/:id')
    async getCategory(@Param('id') id: number) {
        return this.categoryService.getCategory(id);
    }

    @Get('/:categoryId/services')
    async getServicesByCategories(@Param('categoryId') categoryId: number, @Query() query: QueryServiceByCategoryDto, @User("storeId") storeId: number) {
        let categories = await this.categoryService.getServicesByCategories(categoryId, query, storeId)
        return categories.map((category) => ({ ...category, selected: !!category.selected, addNew: !!category.addNew }))
    }

    @Put('/:categoryId/services')
    updateServicesByCategories(@Param('categoryId') categoryId: number, @Body() body: UpdateServicesByCategoryDto) {
        return this.categoryService.updateServicesByCategories(categoryId, body)
    }

    @Delete("/:id")
    deleteCategory(@Param("id") id: number, @User("storeId") storeId: number) {
        return this.categoryService.deleteCategory(id, storeId)
    }

}
