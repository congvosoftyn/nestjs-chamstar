import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { User } from '../user/decorators/user.decorator';
import { UpdatePromotionDto } from './dto/UpdatePromotion.dto';
import { PromotionService } from './promotion.service';

@Controller('promotion')
@ApiTags('promotion')
export class PromotionController {
    constructor(private promotionService: PromotionService) { }

    @Get()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getPromotions(@Query('search') search: string, @User('companyId') companyId: number) {
        return this.promotionService.getPromotions(search, companyId);
    }

    @Post()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async updatePromotion(@Body() body: UpdatePromotionDto, @User('companyId') companyId: number, @User('storeId') storeId: number) {
        return this.promotionService.updatePromotion(body, companyId, storeId);
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async deletePromotion(@Param('id') id: number): Promise<{ status: string }> {
        return this.promotionService.deletePromotion(id);
    }

}
