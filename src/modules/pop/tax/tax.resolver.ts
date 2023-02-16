import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { TaxEntity } from "src/entities/Tax.entity";
import { User } from "src/modules/user/decorators/user.decorator";
import JwtAuthenticationGuard from "src/shared/guards/jwtAuthenticationGuard";
import { NewTaxInput } from "./dto/NewTax.input";
import { TaxService } from "./tax.service";

@Resolver(() => TaxEntity)
@UseGuards(JwtAuthenticationGuard)
export class TaxResolver {
    constructor(private readonly taxService: TaxService) { }

    // @ApiBearerAuth('access-token')
    @Query(()=>TaxEntity)
    async getAllTax(@User('storeId') storeId: number) {
        return this.taxService.getAllTax(storeId);
    }

    // @ApiBearerAuth('access-token')
    @Query(()=>TaxEntity)
    @UsePipes(new ValidationPipe())
    async newTax(@Args('newTax') newTax: NewTaxInput, @User('storeId') storeId: number) {
        return this.taxService.newTax(newTax, storeId);
    }

    // @ApiBearerAuth('access-token')
    @Query(()=>TaxEntity)
    @UsePipes(new ValidationPipe())
    async updateTax(@Args('updateTax') updateTax: NewTaxInput, @User('storeId') storeId: number) {
        return this.taxService.newTax(updateTax, storeId);
    }

    // @ApiBearerAuth('access-token')
    @Query(()=>TaxEntity)
    async deleteTax(@Args('id',{type:()=>Int}) id: number) {
        return this.taxService.deleteTax(id);
    }

}