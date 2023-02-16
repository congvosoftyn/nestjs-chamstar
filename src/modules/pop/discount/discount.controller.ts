import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { DiscountService } from './discount.service';
import { NewDiscountDto } from './dto/NewDiscount.dto';

@Controller('pop/discount')
@ApiTags('pop/discount')
export class DiscountController {
    constructor(private readonly discountService: DiscountService) { }

    @Get()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getStoreDiscounts(@User('storeId') storeId: number) {
        return this.discountService.getStoreDiscounts(storeId);
    }

    @Post()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async newDiscount(@Body() body: NewDiscountDto, @User('storeId') storeId: number) {
        return this.discountService.newDiscount(body, storeId);
    }

    @Put('/:id')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async updateDiscount(@Param("id") id: number, @Body() body: NewDiscountDto, @User('storeId') storeId: number) {
        return this.discountService.updateDiscount(id, body, storeId);
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async deleteDiscount(@Param('id') id: number) {
        return this.discountService.deleteDiscount(id);
    }
}
