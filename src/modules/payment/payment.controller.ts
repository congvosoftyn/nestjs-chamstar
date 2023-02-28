import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { User } from '../user/decorators/user.decorator';
import { FindPaymentDto } from './dto/FindPayment.dto';
import { GetPaymentsDto } from './dto/GetPayments.dto';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payment')
@ApiTags('payment')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @Post()
    payment(@User("storeId") storeId: number, @Body() data: CreatePaymentDto) {
        return this.paymentService.payment(storeId, data)
    }

    @Get('/all')
    async getPayments(@Query() { skip, take }: GetPaymentsDto, @User('companyId') companyId: number) {
        return this.paymentService.getPayments(skip, take, companyId);
    }

    @Get('/find')
    async findPayment(@Query() { pageNumber, pageSize }: FindPaymentDto, @User('companyId') companyId: number) {
        return this.paymentService.findPayment(pageNumber, pageSize, companyId);
    }
}
