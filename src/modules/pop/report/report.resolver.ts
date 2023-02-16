import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { PaymentTransactionEntity } from "src/entities/PaymentTransaction.entity";
import { User } from "src/modules/user/decorators/user.decorator";
import JwtAuthenticationGuard from "src/shared/guards/jwtAuthenticationGuard";
import { QueryGetReportDto } from "./dto/QueryGetReport.dto";
import { QueryGetReportInput } from "./dto/QueryGetReport.input";
import { ReportService } from "./report.service";

@Resolver(() => PaymentTransactionEntity)
@UseGuards(JwtAuthenticationGuard)
export class ReportResolver {
    constructor(private readonly reportService: ReportService) { }

    // @ApiBearerAuth('access-token')
    @Query(() => PaymentTransactionEntity)
    @UsePipes(new ValidationPipe())
    async getReport(@Args('_queryGetReportDto') _queryGetReportDto: QueryGetReportInput, @User('storeId') storeId: number) {
        return this.reportService.getReport(_queryGetReportDto, storeId);
    }

    // @ApiBearerAuth('access-token')
    @Query(() => PaymentTransactionEntity, { name: 'transaction' })
    async getTransaction(@User('storeId') storeId: number) {
        return this.reportService.getTransaction(storeId);
    }
}