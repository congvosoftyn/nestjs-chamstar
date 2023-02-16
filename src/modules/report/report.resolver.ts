import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { CheckInEntity } from "src/entities/CheckIn.entity";
import JwtAuthenticationGuard from "src/shared/guards/jwtAuthenticationGuard";
import { User } from "../user/decorators/user.decorator";
import { ReportService } from "./report.service";

@Resolver(() => CheckInEntity)
@UseGuards(JwtAuthenticationGuard)
export class ReportResolver {
    constructor(private reportService: ReportService) { }

    // @ApiBearerAuth('access-token')
    @Query(()=>CheckInEntity)
    async getReports(@User('companyId') companyId: number) {
        return this.reportService.getReports(companyId);
    }
}