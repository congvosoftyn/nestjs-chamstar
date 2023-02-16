import { Injectable } from '@nestjs/common';
import { GiftCardEntity } from 'src/entities/GiftCard.entity';
import { PaymentTransactionEntity } from 'src/entities/PaymentTransaction.entity';
import { ProductEntity } from 'src/entities/Product.entity';
import { SaleGiftCardEntity } from 'src/entities/SaleGiftCard.entity';
import { SaleTransactionEntity } from 'src/entities/SaleTransaction.entity';
import { EmailService } from 'src/modules/email/email.service';

@Injectable()
export class SaleService {
    private eGiftCardStartingCode: number = 1110
    constructor(private readonly emailService: EmailService) { }

    async newSale(sale: SaleTransactionEntity, storeId: number, companyId: number) {
        for (let i = 0; i < sale.products.length; i++) {
            let p = sale.products[i];
            //Customer amount product
            if (!p.product.id) {
                p.product.storeId = storeId;
                p.product.isActive = false;
                await ProductEntity.save(p.product);
            }
            if (p.saleGiftCard) {
                let giftCard = await GiftCardEntity.findOneBy({ id: p.saleGiftCard.code })
                if (!giftCard) {
                    giftCard = new GiftCardEntity();
                    if (p.saleGiftCard.code === this.eGiftCardStartingCode && p.saleGiftCard.recipientEmail) {
                        // eGiftCard case
                        const eGiftCardCode = this.generateEGiftCardCode()
                        p.saleGiftCard.code = eGiftCardCode
                        giftCard.id = eGiftCardCode
                    } else {
                        giftCard.id = p.saleGiftCard.code;
                    }
                    giftCard.companyId = companyId;
                    giftCard.balance = p.saleGiftCard.loadedBalance;
                } else {
                    giftCard.balance += p.saleGiftCard.loadedBalance;
                }

                sale.products[i].saleGiftCard = await SaleGiftCardEntity.save(sale.products[i].saleGiftCard);
                await giftCard.save();
                await this.sendEGiftCardToCustomer(p.saleGiftCard)
            }
        }

        return await SaleTransactionEntity.save(sale)
    }

    async getSales(storeId: number) {
        const _7day = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        return await SaleTransactionEntity
            .createQueryBuilder('sale')
            .leftJoin('sale.register', 'register')
            .leftJoinAndSelect('sale.customer', 'customer')
            .leftJoinAndSelect('sale.products', 'products')
            .leftJoinAndSelect('sale.payments', 'payments')
            .leftJoinAndSelect('sale.assign', 'assign')
            .leftJoinAndSelect('products.product', 'product')
            .leftJoinAndSelect('products.productOption', 'productOption')
            .leftJoinAndSelect('products.modifierOptions', 'modifierOptions')
            .leftJoinAndSelect('products.taxes', 'taxes')
            .leftJoinAndSelect('products.discounts', 'discounts')
            .leftJoinAndSelect('products.saleGiftCard', 'giftCards')
            .where('register.storeId = :storeId', { storeId })
            .andWhere('sale.created > :days', { days: _7day })
            .orderBy('sale.created', 'DESC')
            .getMany();
    }

    async addPayment(payment: PaymentTransactionEntity) {
        return await PaymentTransactionEntity.save(payment);
    }

    generateEGiftCardCode(): number {
        let eGiftCardCode = this.eGiftCardStartingCode + ''
        for (let i = 0; i < 12; i++) {
            eGiftCardCode += Math.floor(Math.random() * 10);
        }
        return parseInt(eGiftCardCode)
    }

    private async sendEGiftCardToCustomer(eGiftCard: SaleGiftCardEntity) {
        //TODO: load html email template
        if (!eGiftCard.recipientEmail) return
        try {
            await this.emailService.sendMail({
                from: '"Uzmos"<no-reply@uzmos.com>',
                to: eGiftCard.recipientEmail,
                subject: 'E-GiftCard',
                html: `E-Card-Code : ${eGiftCard.code}`
            })
        } catch (err) {
            throw new Error('Fail to send eGiftCard email to recipient')
        }

    }
}
