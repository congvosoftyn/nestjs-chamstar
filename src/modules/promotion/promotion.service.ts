import { Injectable } from '@nestjs/common';
import { PromotionEntity } from 'src/entities/Promotion.entity';
import { Like } from 'typeorm';
import { UpdatePromotionDto } from './dto/UpdatePromotion.dto';

@Injectable()
export class PromotionService {
    async getPromotions(search: string, companyId: number) {
        return await PromotionEntity.find({
            where: { companyId: companyId, name: Like(`%${search}%`) },
            order: { name: 'ASC' }
        });
        // promos.forEach((v, i, a) => {
        //     a[i].groups = v.groups.join(',')
        // })
    }

    async updatePromotion(body: UpdatePromotionDto, companyId: number, storeId: number) {
        body.groups = body.groups.split('').join(",");
        const promo = body as PromotionEntity;
        promo.companyId = companyId;
        promo.storeId = storeId;
        if (!promo.id)
            promo.createDate = new Date();

        await PromotionEntity.save(promo);
        return promo;
    }

    async deletePromotion(promoId: number): Promise<{ status: string }> {
        await PromotionEntity.delete(promoId);
        return { status: 'deleted' };
    }
}
