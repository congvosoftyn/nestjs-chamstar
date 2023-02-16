import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import { CompanyEntity } from 'src/entities/Company.entity';
import { UserEntity } from 'src/entities/User.entity';
import Stripe from 'stripe';

@Injectable()
export class StripesService {
    public constructor(@InjectStripe() private readonly stripe: Stripe) { }

    async createACharge(token: string, amount: number, companyId: number, userId: number) {
        if (amount <= 0) return;

        const user = await UserEntity.findOneBy({id: userId});
        const company = await CompanyEntity.findOneBy({id: companyId});
        return  this.stripe.charges.create(
            {
                amount: amount * 100,
                currency: 'usd',
                source: token,
                description: 'Charge for ' + company.name,
                receipt_email: user.email
            }
        );
    }

    async createACustomerCharge(card: string, amount: number, companyId: number, userId: number) {
        if (amount <= 0) return;
        const total = Math.round(amount * 100);
        const user = await UserEntity.findOneBy({id: userId});
        const company = await CompanyEntity.findOneBy({id: companyId});
        return await this.stripe.charges.create(
            {
                amount: total,
                currency: 'usd',
                customer: company.stripeCustomerId,
                source: card,
                description: 'Charge for ' + company.name,
                receipt_email: user.email
            }
        );
    }
    async createCustomer(companyId: number) {
        const company = await CompanyEntity.findOneBy({id: companyId});
        return await this.stripe.customers.create(
            {
                name: company.name,
                address: {
                    line1: company.address,
                    city: company.city,
                    state: company.state,
                }
            }
        );
    }

    async updateCustomerWithCardToken(companyId: number, token: string) {
        const company = await CompanyEntity.findOneBy({id: companyId});
        if (company) {
            await this.stripe.customers.update(company.stripeCustomerId, {
                source: token,
            });
        }
    }


    async addCardToCustomer(companyId: number, source: string) {
        const company = await CompanyEntity.findOneBy({id: companyId});
        if (company) {
            return await this.stripe.customers.createSource(company.stripeCustomerId, {
                source: source,
            });
        } else {
            return null;
        }
    }

    async updateDefaultCard(companyId: number, card: string) {
        const company = await CompanyEntity.findOneBy({id: companyId});
        if (company) {
            return await this.stripe.customers.update(company.stripeCustomerId, {
                default_source: card,
            });
        } else {
            return null;
        }
    }


    async addBankToCustomer(companyId: number) {
        const company = await CompanyEntity.findOneBy({id: companyId});
        return await this.stripe.customers.createSource(company.stripeCustomerId, {
            source: {
                object: 'bank_account',
                country: 'US',
                currency: 'USD',
                account_holder_name: 'Account Holder',
                account_holder_type: 'individual',
                account_number: '000123456789',
                routing_number: '110000000',
            } as any,
        });
    }

    async deleteACard(companyId: number, cardId: string) {
        const company = await CompanyEntity.findOneBy({id: companyId});
        return await this.stripe.customers.del(company.stripeCustomerId, cardId);
    }

    async listCards(companyId: number) {
        const company = await CompanyEntity.findOneBy({id: companyId});
        if (!company.stripeCustomerId) {
            const stripCustomer = await this.createCustomer(companyId);
            company.stripeCustomerId = stripCustomer.id;
            await company.save();
        }
        return await this.stripe.customers.listSources(company.stripeCustomerId, {
            object: 'card',
            limit: 100,
        });
    }

    async getCustomer(companyId: number) {
        const company = await CompanyEntity.findOneBy({id: companyId});
        return await this.stripe.customers.retrieve(company.stripeCustomerId);
    }

    async listBankAccount(companyId: number) {
        const company = await CompanyEntity.findOneBy({id: companyId});
        return this.stripe.customers.listSources(company.stripeCustomerId, {
            object: 'bank_account',
            limit: 100,
        })
    }
}
