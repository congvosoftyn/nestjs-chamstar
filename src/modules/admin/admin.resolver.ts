import { Query, Resolver } from "@nestjs/graphql";
import { CompanyCustomerEntity } from "src/entities/CompanyCustomer.entity";
import { ReviewEntity } from "src/entities/Review.entity";
import { Any } from "typeorm";
import { User } from "../user/decorators/user.decorator";
import { AdminService } from "./admin.service";

@Resolver(() => Any)
export class AdminResolver {
    constructor(private adminService: AdminService) { }

    @Query(() => CompanyCustomerEntity, { name: "getMenu" })
    async getMenuData(@User('companyId') companyId: number) {
        return this.adminService.getMenuData(companyId);
    }

    @Query(() => ReviewEntity, { name: "getRate" })
    async getReviewRate(@User('storeId') storeId: number) {
        return this.adminService.getReviewRate(storeId);
    }
}