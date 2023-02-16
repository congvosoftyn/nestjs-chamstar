import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CompanyCustomerEntity } from 'src/entities/CompanyCustomer.entity';
import { GiftCardEntity } from 'src/entities/GiftCard.entity';

@Injectable()
export class GiftCardService {
    async redeemGiftCard(code: number, customerId: number) {
        const giftcard = await GiftCardEntity.findOneBy({ code })
        if (!giftcard) throw new HttpException('Invalid request - Validation Failed!', HttpStatus.BAD_REQUEST);

        const companyId = giftcard.companyId
        const customer = await CompanyCustomerEntity.findOne({ where: { customerId, companyId } })
        if (!customer) throw new HttpException(`not found with id ${customerId}`, HttpStatus.NOT_FOUND);

        customer.giftCardBalance += giftcard.balance
        giftcard.balance = 0
        await customer.save()
        giftcard.save()
        return customer;
    }

    async createGiftCard(_giftCard: GiftCardEntity, companyId: number) {
        _giftCard.companyId = companyId
        await GiftCardEntity.save(_giftCard)
        return _giftCard;
    }

    async checkGiftCardExist(code: number) {
        return await GiftCardEntity.findOneBy({ code })
    }
}
