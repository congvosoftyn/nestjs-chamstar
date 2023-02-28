import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from 'src/entities/Product.entity';
import { NewProductDto } from './dto/NewProduct.dto';
import { ReOrderProductsDto } from './dto/ReOrderProducts.dto';
import { UpdateOrderByIdDto } from './dto/UpdateOrderById.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

@Injectable()
export class ProductService {

    async getAllProductsByStore(storeId: number, search: string, size: number = 50, page: number = 0) {
        const [products, count] = await ProductEntity.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.tax', 'tax')
            .where('product.isActive = true and product.isService = false')
            .andWhere('product.storeId = :storeId', { storeId })
            .andWhere(`product.name like :keywork`, { keywork: `%${search}%` })
            .take(size)
            .skip(size * page)
            .orderBy('product.orderBy', "ASC")
            .getManyAndCount()

        return new PaginationDto(products, count, page, size)
    }

    getProductsByCategoryId(id: number, storeId: number) {
        let query = ProductEntity.createQueryBuilder('product')
            .leftJoinAndSelect('product.tax', 'tax')
            .where('product.isActive = true')
            .andWhere('product.storeId = :storeId', { storeId })
            .orderBy('product.orderBy', "ASC");
        if (id.toString() != 'all') {
            query = query.andWhere('product.categoryId = :id', { id })
        }

        return query.getMany();
    }

    newProduct(body: NewProductDto, storeId: number) {
        return ProductEntity.save(<ProductEntity>{ ...body, storeId, serviceDuration: 0 })
    }

    async updateProduct(id: number, body: NewProductDto, storeId: number) {
        await ProductEntity.createQueryBuilder().update(<ProductEntity>{ ...body}).where("id = :id and storeId = :storeId", { id, storeId }).execute()
        return ProductEntity.createQueryBuilder("product").leftJoinAndSelect('product.tax', 'tax').where("product.id = :id and product.storeId = :storeId", { id, storeId }).getOne()
    }

    async deleteProduct(id: number, _option: string) {
        // route ex: /pos/product/12?option=delete
        // if option delete included in request, we will delete product from database, otherwise keep product and make it isActive = false
        const delete_from_db: boolean = _option === 'delete';

        const product = await ProductEntity.findOneBy({ id })

        if (!product) throw new NotFoundException(id)
        // if (delete_from_db) {
        //     const deletedProduct = await ProductEntity.remove(product)
        //     return { ...deletedProduct, id: id };  // parase query id type string to int 
        // }
        // product.isActive = false
        // return product.save()
        return ProductEntity.createQueryBuilder().update({ isActive: false }).where("id = :id", { id }).execute()
    }

    async updateOrderById(body: UpdateOrderByIdDto) {
        const product = body;
        ProductEntity.update(product.id, { orderBy: product.orderBy })
        return product;
    }

    // route handle reorder products, we update orderBy on frontend and save whole list in api
    reOrderProducts(body: ReOrderProductsDto) {
        const products = body as unknown as ProductEntity[]
        return ProductEntity.save(products)
    }
}
