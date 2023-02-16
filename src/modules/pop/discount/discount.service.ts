import { Injectable, NotFoundException } from '@nestjs/common';
import { DiscountEntity } from 'src/entities/Discount.entity';
import { NewDiscountDto } from './dto/NewDiscount.dto';

@Injectable()
export class DiscountService {

    getStoreDiscounts(storeId: number) {
        return DiscountEntity.find({ where: { storeId } })
    }

    async newDiscount(body: NewDiscountDto, storeId: number) {
        const discount = body as DiscountEntity
        discount.storeId = storeId;
        return DiscountEntity.save(discount)
    }

    async deleteDiscount(id: number) {
        const discount = await DiscountEntity.findOneBy({ id })
        if (!discount) throw new NotFoundException(id)
        const deletedDiscount = await DiscountEntity.remove(discount)
        return { ...deletedDiscount, id: id }
    }

    async updateDiscount(id: number, body: NewDiscountDto, storeId: number) {
        await DiscountEntity.createQueryBuilder().update(body).where("id = :id and storeId = :storeId", { id, storeId }).execute()
        return DiscountEntity.findOne({ where: { id: id } })
    }
}
