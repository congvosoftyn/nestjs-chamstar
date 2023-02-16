import { Injectable } from '@nestjs/common';
import { AddonEntity } from 'src/entities/Addon.entity';
import { BillingEntity } from 'src/entities/Billing.entity';
import { CompanyEntity } from 'src/entities/Company.entity';
import { PackageAddonEntity } from 'src/entities/PackageAddon.entity';
import { PaymentEntity } from 'src/entities/Payment.entity';
import { AddAddonToBillDto } from './dto/AddAddonToBill.dto';
import { InAppPurchaseAddonDto } from './dto/InAppPurchaseAddon.dto';

@Injectable()
export class AddonService {

    async getAddon() {
        return AddonEntity.find({ where: { isActive: true }, order: { orderBy: 'ASC' } });
    }

    // async addAddonToBill(companyId: number, addon: AddAddonToBillDto) {
    //     const packageAddon = new PackageAddonEntity();
    //     packageAddon.name = addon.name;
    //     packageAddon.messageUsage = addon.messageUsage;
    //     packageAddon.price = addon.price;
    //     packageAddon.description = addon.description;
    //     await packageAddon.save();

    //     const bill = await BillingEntity.createQueryBuilder('billing')
    //         .leftJoin('billing.subscription', 'subscription')
    //         .leftJoinAndSelect('billing.addons', 'addons')
    //         .where('subscription.companyId = :companyId', { companyId }).getOne();
    //     bill.addons.push(packageAddon);
    //     await bill.save();

    //     //Add to company balance 
    //     const company = await CompanyEntity.findOneBy({id: companyId});
    //     company.balance = (+company.balance) + (+addon.price);
    //     company.save();
    //     return packageAddon;
    // }

    // async inAppPurchaseAddon(body: InAppPurchaseAddonDto, companyId: number) {
    //     const addon = body.addon as PackageAddonEntity;
    //     const iap = body.iap;

    //     const packageAddon = new PackageAddonEntity();
    //     packageAddon.name = addon.name;
    //     packageAddon.messageUsage = addon.messageUsage;
    //     packageAddon.price = addon.price;
    //     packageAddon.description = addon.description;
    //     await packageAddon.save();

    //     const bill = await BillingEntity.createQueryBuilder('billing')
    //         .leftJoin('billing.subscription', 'sub')
    //         .leftJoinAndSelect("billing.addons", "addons")
    //         .where('sub.companyId=:companyId', { companyId })
    //         .getOne();
    //     //.findOne({where : {companyId}, relations: ['addons']});
    //     bill.addons.push(packageAddon);
    //     bill.save();
    //     if (iap) {
    //         const payment = new PaymentEntity();
    //         payment.stripeId = iap ? iap.receipt : '';
    //         payment.amount = addon.price;
    //         payment.payment_method = 'In App Purchase';
    //         payment.billingId = bill.id;
    //         payment.save();
    //     }

    //     return addon;
    // }
}
