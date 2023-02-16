import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ReceiptEntity, RECEIPT_BY_EMAIL, RECEIPT_BY_TEXT } from 'src/entities/Receipt.entity';
import { SaleTransactionEntity } from 'src/entities/SaleTransaction.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import { EmailService } from 'src/modules/email/email.service';
import TextMessage from 'src/shared/utils/Message';

@Injectable()
export class ReceiptService {
    constructor(private readonly emailService: EmailService) { }

    // async sendReceiptToCustomer(body: SendReceiptToCustomerDto, storeId: number) {
    async sendReceiptToCustomer(receipt: ReceiptEntity, storeId: number) {
        // const receipt = body as ReceiptEntity

        const store = await StoreEntity.findOneBy({id: storeId});
        if (!store) throw new HttpException(`not found with id ${storeId}`, HttpStatus.NOT_FOUND);

        await ReceiptEntity.save(receipt)
        const receiptUrl = process.env.RECEIPT_URL
        const message: string = `
            Thank you for shopping at ${store.name}, check your receipt via: ${receiptUrl}?reference=${receipt.reference}
            `
        switch (receipt.methodType) {
            case RECEIPT_BY_EMAIL:
                //TODO: load html email template
                this.emailService.sendMail({
                    from: '"Uzmos"<no-reply@uzmos.com>',
                    to: receipt.customerInfo,
                    subject: 'RECEIPT',
                    html: message
                })
                // code block
                break;
            case RECEIPT_BY_TEXT:
                // code block
                const textService = new TextMessage()
                textService.sendMessage(receipt.customerInfo, message)
                break;
        }

        return { success: true, customerInfo: receipt.customerInfo };
    }

    async getReceiptInfoByReference(reference: string) {
        const receipt = await ReceiptEntity.findOneBy({ reference })
        if (!receipt) throw new NotFoundException(reference)
        const saleData = await SaleTransactionEntity
            .createQueryBuilder('sale')
            .leftJoinAndSelect('sale.customer', 'customer')
            .leftJoinAndSelect('sale.products', 'products')
            .leftJoinAndSelect('sale.payments', 'payments')
            .leftJoinAndSelect('sale.register', 'register')
            .leftJoinAndSelect('register.store', 'store')
            .leftJoinAndSelect('products.product', 'product')
            .leftJoinAndSelect('products.productOption', 'productOption')
            .leftJoinAndSelect('products.modifierOptions', 'modifierOptions')
            .leftJoinAndSelect('products.taxes', 'taxes')
            .leftJoinAndSelect('products.discounts', 'discounts')
            .leftJoinAndSelect('products.saleGiftCard', 'giftCards')
            .where('sale.reference = :reference', { reference })
            .getOne()
        if (!saleData) throw new NotFoundException(reference)
        receipt.buildReceiptFromSaleTransaction(saleData)
        return receipt;
    }
}
