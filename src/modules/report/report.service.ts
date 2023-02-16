import { Injectable } from '@nestjs/common';
import { CheckInEntity } from 'src/entities/CheckIn.entity';
import { ProductEntity } from 'src/entities/Product.entity';
import { RewardClaimedEntity } from 'src/entities/RewardClaimed.entity';
import { QuerySaleByItemDto } from './dto/query-sale-by-item.dto';

@Injectable()
export class ReportService {
    async getReports(companyId: number) {

        const end = new Date(Date.now() - 30 * 24 * 3600 * 1000)
        end.setHours(0, 0, 0, 0);

        const filters: any = {
            after: end.toISOString() as any,
        };

        const checkInCount = await CheckInEntity.createQueryBuilder('checkin')
            .select(["count(*) as y", "date(checkin.checkinDate) as t"])
            .leftJoin("checkin.companyCustomer", "customer")
            .where("customer.companyId = " + companyId)
            .andWhere('checkInDate >= :after')
            .groupBy('t')
            .orderBy({ t: 'DESC' })
            .setParameters(filters).getRawMany();


        const claimCount = await RewardClaimedEntity.createQueryBuilder('claimReward')
            .select(["count(*) as y", "date(claimReward.claimDate) as t"])
            .leftJoin("claimReward.companyCustomer", "customer")
            .where("customer.companyId = " + companyId)
            .andWhere('claimDate >= :after')
            .groupBy('t')
            .orderBy({ t: 'DESC' })
            .setParameters(filters).getRawMany();

        return { checkInCount, claimCount };
    }

    async salesByItems(query: QuerySaleByItemDto, storeId: number) {
        return ProductEntity.createQueryBuilder("service")
            .select([
                "service.id", "service.name", "service.price", 
                "COUNT(service.id) as item_sold", "COUNT(service.id)*service.price as gross_sales"
            ])
            .leftJoin("service.bookingInfo", "bookingInfo")
            .leftJoin("bookingInfo.booking", "booking")
            .where("service.isService = true")
            .andWhere("booking.date between :startDate and :endDate", { startDate: query.startDate, endDate: query.endDate })
            .andWhere("service.storeId = :storeId", { storeId: storeId })
            .groupBy("service.id")
            .orderBy("service.id", "ASC")
            .getRawMany()
    }
}
