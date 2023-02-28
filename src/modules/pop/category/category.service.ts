import { Injectable } from '@nestjs/common';
import { PackageEntity } from 'src/entities/Package.entity';
import { ProductEntity } from 'src/entities/Product.entity';
import { CategoryEntity } from 'src/entities/Category.entity';
import { NewCategoryDto } from './dto/NewCategory.dto';
import { QueryServiceByCategoryDto } from './dto/query-service-by-category.dto';
import { UpdateServicesByCategoryDto } from './dto/update-service-by-categories.dto';

@Injectable()
export class CategoryService {
  async getAllCategoriesByStore(storeId: number, search: string) {
    const categories = await CategoryEntity
      .createQueryBuilder('category')
      .leftJoinAndSelect("category.services", "services", "services.isService = true AND services.isActive = true ")
      .leftJoinAndSelect("services.staffs", "staffs")
      .leftJoinAndSelect("services.tax", "tax")
      .leftJoinAndSelect("category.packages", "packages", "packages.deleted = true")
      .leftJoin("packages.services", "_services", "_services.isService = true")
      .addSelect(["_services.serviceDuration", "_services.name", "_services.id"])
      .where('category.storeId = :storeId', { storeId })
      .andWhere(`category.name like :keywork`, { keywork: `%${search}%` })
      .andWhere("category.isActive = true")
      .orderBy('category.id', 'DESC')
      .getMany()

    for (let category of categories) {
      category = this.convertPackageInServices(category)
    }

    return categories
  }

  getAllCategoriesForCart(storeId: number) {
    return CategoryEntity.createQueryBuilder('category')
      .leftJoinAndSelect('category.services', 'services', 'services.isActive = true',)
      .leftJoinAndSelect('services.taxes', 'taxes')
      .leftJoinAndSelect('services.productOptions', 'productOptions')
      .leftJoinAndSelect('services.modifiers', 'modifiers')
      .leftJoinAndSelect('modifiers.modifierOptions', 'modifierOptions')
      .where({ storeId })
      .andWhere("category.isActive = true")
      .orderBy('category.orderBy')
      .orderBy('services.orderBy')
      .getMany();
  }

  convertPackageInServices(category: CategoryEntity) {
    const packages = category.packages.map((pack) => ({
      ...pack,
      duration: pack.services?.reduce((a, b) => a + b.serviceDuration, 0),
      // price: pack.services?.reduce((a, b) => a + parseFloat(b.price.toString()), 0)
    }))
    category.packages = packages as unknown as [PackageEntity]
    return category;
  }

  newCategory(body: NewCategoryDto, storeId: number) {
    return CategoryEntity.save(<CategoryEntity>{ ...body, storeId });
  }

  async updateCategory(id: number, body: NewCategoryDto) {
    let category = await CategoryEntity.findOne({ where: { id } });
    category.name = body.name;
    return CategoryEntity.save(category);
  }

  async getCategory(id: number) {
    return CategoryEntity.createQueryBuilder('category')
      .leftJoinAndSelect("category.services", "services")
      .leftJoinAndSelect("services.staffs", "staffs")
      .leftJoinAndSelect("services.tax", "tax")
      .where("category.id = :id", { id })
      .andWhere("category.isActive = true")
      .getOne()
  }

  getServicesByCategories(categoryId: number, query: QueryServiceByCategoryDto, storeId: number) {
    /**
     * addNew help dev verify logic add, remove, update with only once loop
     * addNew is flag return form backend, to define that item is exists from old list ( different with new item add from FE - always addNew: false)
     * addNew is immutable (true: can remove from list data, false: cannot remove from list data)
     */
    return ProductEntity.createQueryBuilder('service')
      .select(['service.id', 'service.name as name', '(category.id is not null) as selected', '(category.id is null) as addNew'])
      .leftJoin('service.category', 'category', `category.id = ${categoryId} and category.isActive = true`)
      .addSelect('category.id')
      .where("service.isService = true and service.storeId = :storeId", { storeId })
      .andWhere(`service.name like :keywork `, { keywork: `%${query.search}%` })
      .orderBy('service.id', 'ASC')
      .take(query.take || 20)
      .skip(query.skip || 0)
      .getRawMany()
  }

  updateServicesByCategories(categoryId: number, body: UpdateServicesByCategoryDto) {
    let categoriesRemove = []
    let categoriesAdd = []

    for (const category of body.categories) {
      if (!category.selected) { //remove
        categoriesRemove.push(category.service_id)
      }
      if (category.addNew) { // add new
        categoriesAdd.push(category.service_id)
      }
    }

    if (categoriesRemove.length !== 0) {
      // remove all: update category set categoryId = null where id in (:categoriesRemove)
      ProductEntity.createQueryBuilder().update({ categoryId: null }).where(`id in (:ids)`, { ids: categoriesRemove }).execute()
    }
    if (categoriesAdd.length !== 0) {
      // update all update category set categoryId = :categoryId where id in (:categoriesAdd)
      ProductEntity.createQueryBuilder().update({ categoryId: categoryId }).where(`id in (:ids)`, { ids: categoriesAdd }).execute()
    }

    return this.getCategory(categoryId)
  }

  deleteCategory(categoryId: number, storeId: number,) {
    ProductEntity.createQueryBuilder().update({ categoryId: null }).where("categoryId = :categoryId", { categoryId }).execute()
    return CategoryEntity.createQueryBuilder().update({ isActive: false }).where("id = :id and storeId = :storeId", { id: categoryId, storeId }).execute()
  }
}
