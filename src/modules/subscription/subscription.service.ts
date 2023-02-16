import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionEntity } from 'src/entities/Subscription.entity';
import { Repository } from 'typeorm';
import { UpgradeSubscriptionDto } from './dto/UpgradeSubscription.dto';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectRepository(SubscriptionEntity)
        private readonly subscriptionRepository: Repository<SubscriptionEntity>
    ) { }


    async getSubscription(companyId: number) {
        return await SubscriptionEntity.find({ where: { companyId }, order: { created: 'DESC' }, relations: ['package', 'package.siteModules'] });
    }

    async upgradeSubscription(body: UpgradeSubscriptionDto, companyId: number,) {
        const { subscription, selectedPackage } = body;
        await this.subscriptionRepository.update(subscription, { isActive: false })
        let newSub = new SubscriptionEntity();
        newSub.companyId = companyId;
        newSub.packageId = selectedPackage;
        await newSub.save();
        return newSub;
    }

    async findSubscription(pageNumber: number, pageSize: number, companyId: number) {
        const rootQuery = SubscriptionEntity
            .createQueryBuilder('sub')
            .leftJoinAndSelect('sub.package', 'package')
            .where('sub.companyId = :companyId', { companyId });

        const bills = await rootQuery
            .skip(pageNumber ? +pageNumber : 0)
            .take(pageSize ? +pageSize : 10)
            .orderBy('sub.created', 'DESC')
            .getMany();
        const total = await rootQuery.getCount();
        return { items: bills, totalCount: total };
    }
}
