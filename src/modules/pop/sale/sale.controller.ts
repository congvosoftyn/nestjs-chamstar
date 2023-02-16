import { Body, Controller, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentTransactionEntity } from 'src/entities/PaymentTransaction.entity';
import { SaleTransactionEntity } from 'src/entities/SaleTransaction.entity';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { SaleService } from './sale.service';

@Controller('pop/sale')
@ApiTags('pop/sale')
export class SaleController {
    constructor(private readonly saleService: SaleService) { }

    @Get()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getSales(@User('storeId') storeId: number) {
        return this.saleService.getSales(storeId);
    }

    @Post()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async newSale(@Body() body: SaleTransactionEntity, @User('storeId') storeId: number, @User('companyId') companyId: number) {
        return this.saleService.newSale(body, storeId, companyId);
    }

    @Post(':id')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async addPayment(@Body() payment: PaymentTransactionEntity) {
        return this.saleService.addPayment(payment);
    }
}
