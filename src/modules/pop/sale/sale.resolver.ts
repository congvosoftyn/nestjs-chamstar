import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PaymentTransactionEntity } from "src/entities/PaymentTransaction.entity";
import { SaleTransactionEntity } from "src/entities/SaleTransaction.entity";
import { User } from "src/modules/user/decorators/user.decorator";
import JwtAuthenticationGuard from "src/shared/guards/jwtAuthenticationGuard";
import { AddPaymentInput, SaleTransactionInputDTO } from "./dto/add-payment.input";
import { SaleService } from "./sale.service";

@Resolver(() => SaleTransactionEntity)
@UseGuards(JwtAuthenticationGuard)
export class SaleResolver {
    constructor(private readonly saleService: SaleService) { }

    // @ApiBearerAuth('access-token')
    @Query(()=>SaleTransactionEntity)
    async getSales(@User('storeId') storeId: number) {
        return this.saleService.getSales(storeId);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(()=>SaleTransactionEntity)
    @UsePipes(new ValidationPipe())
    async newSale(@Args('newSale') newSale: SaleTransactionInputDTO, @User('storeId') storeId: number, @User('companyId') companyId: number) {
        return this.saleService.newSale(newSale as SaleTransactionEntity, storeId, companyId);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(()=>PaymentTransactionEntity)
    @UsePipes(new ValidationPipe())
    async addPayment(@Args('payment') payment: AddPaymentInput) {
        return this.saleService.addPayment(payment as PaymentTransactionEntity);
    }
}