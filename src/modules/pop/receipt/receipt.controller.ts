import { Body, Controller, Get, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReceiptEntity } from 'src/entities/Receipt.entity';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { ReceiptService } from './receipt.service';

@Controller('pop/receipt')
@ApiTags('pop/receipt')
export class ReceiptController {
    constructor(private readonly receiptService: ReceiptService) { }

    @Get()
    async getReceiptInfoByReference(@Query('reference') reference: string) {
        return this.receiptService.getReceiptInfoByReference(reference);
    }

    @Post()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async sendReceiptToCustomer(@Body() body: ReceiptEntity, @User('storeId') storeId: number) {
        return this.receiptService.sendReceiptToCustomer(body, storeId);
    }

}
