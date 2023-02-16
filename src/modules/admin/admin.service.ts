import { Injectable } from '@nestjs/common';
import { CompanyCustomerEntity } from 'src/entities/CompanyCustomer.entity';
import { ReviewEntity } from 'src/entities/Review.entity';

@Injectable()
export class AdminService {
    async getReviewRate(storeId: number) {
        return await ReviewEntity
            .createQueryBuilder("review")
            .where({ storeId })
            .select("SUM(review.rate)/COUNT(*)", "rate")
            .getRawOne();
    }

    async getMenuData(companyId: number) {
        const customerSum = await CompanyCustomerEntity.createQueryBuilder("companyCustomer")
            .where("companyCustomer.companyId = :companyId", { companyId })
            .getCount();
        const start = new Date();
        const end = new Date();
        end.setHours(0, 0, 0, 0);

        const filters: any = {
            before: start.toISOString() as any,
            after: end.toISOString() as any,
        };

        const checkin = await CompanyCustomerEntity
            .createQueryBuilder("company_customer")
            .leftJoinAndSelect("company_customer.customer", "customer")
            .innerJoinAndSelect("company_customer.checkIn", "checkIn")
            .where({ companyId })
            .andWhere("checkIn.checkInDate >= :after")
            .andWhere("checkIn.checkInDate < :before")
            .orderBy({ checkInDate: "DESC" })
            .setParameters(filters)
            .getCount();
        return { customerSum, checkin };

    }
}
