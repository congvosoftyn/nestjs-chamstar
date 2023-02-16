import { Injectable, NotFoundException } from '@nestjs/common';
import { TaxEntity } from 'src/entities/Tax.entity';
import { NewTaxDto } from './dto/NewTax.dto';

@Injectable()
export class TaxService {
    async getAllTax(storeId: number) {
        return await TaxEntity.createQueryBuilder('tax')
            .leftJoinAndSelect('tax.products', 'products', 'products.isActive = true')
            .where({ storeId, isActive: true })
            .getMany();
    }
    async newTax(body: NewTaxDto, storeId: number) {
        const tax = body as TaxEntity;
        // const isNew = !tax.id
        tax.storeId = storeId;

        // if(!isNew){
        //     // if put method to update, query to make sure tax exists in db
        //     const oldTax = await Tax.findOne(tax.id)
        //     if(!oldTax) throw new NotFoundException(`${tax.id}`)
        // }
        // // save tax
        // if(tax.products) {
        //     const product_ids = tax.products.map(p => p.id)
        //     const products = await Product.findByIds(product_ids)
        //     tax.products = products;
        // }

        return await TaxEntity.save(tax);
    }

    async deleteTax(id: number) {
        const tax = await TaxEntity.findOneBy({ id });
        if (!tax) throw new NotFoundException(id);
        const deletedTax = await TaxEntity.remove(tax);
        return { ...deletedTax, id };
    }
}
