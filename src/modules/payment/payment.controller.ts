import { Body, Controller, Get, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { User } from '../user/decorators/user.decorator';
import { AddNewCardDto } from './dto/AddNewCard.dto';
import { ChargePaymentDto } from './dto/ChargePayment.dto';
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

    @Post('/addCard')
    @UsePipes(new ValidationPipe())
    async addNewCard(@Body() body: AddNewCardDto, @User('companyId') companyId: number) {
        return this.paymentService.addNewCard(body, companyId);
    }

    // @Post('/charge')
    // @UsePipes(new ValidationPipe())
    // async chargePayment(@Body() body: ChargePaymentDto, @User('companyId') companyId: number, @User('userId') userId: number) {
    //     return this.paymentService.chargePayment(body, companyId, userId);
    // }

    @Get('/listCard')
    async listCard(@User('companyId') companyId: number) {
        return this.paymentService.listCard(companyId);
    }

    @Get('/listBankAccount')
    async listBankAccount(@User('companyId') companyId: number) {
        return this.paymentService.listBankAccount(companyId);
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
