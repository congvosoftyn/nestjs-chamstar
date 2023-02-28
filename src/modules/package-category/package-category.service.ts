import { Injectable } from '@nestjs/common';
import { PackageEntity } from 'src/entities/Package.entity';
import { CreatePackageCategoryDto } from './dto/create-package-category.dto';
import { UpdatePackageCategoryDto } from './dto/update-package-category.dto';

@Injectable()
export class PackageCategoryService {
  async create(createPackageCategoryDto: CreatePackageCategoryDto) {
    return PackageEntity.save(createPackageCategoryDto as unknown as PackageEntity);
  }

  findAll() {
    return PackageEntity.createQueryBuilder('package')
      .leftJoin("package.category", "category")
      .leftJoin("package.bookingInfo", "bookingInfo")
      .leftJoin("package.services", "services","services.isService = true")
      .getMany();
  }

  findOne(id: number) {
    return PackageEntity.createQueryBuilder('package')
      .leftJoinAndSelect("package.category", "category")
      .leftJoinAndSelect("package.services", "services")
      .where("package.id = :id and deleted = true", { id })
      .getOne();
  }

  async update(id: number, updatePackageCategoryDto: UpdatePackageCategoryDto) {
    const _package = updatePackageCategoryDto as unknown as PackageEntity;
    _package.id = id;
    return PackageEntity.save(_package);
  }

  remove(id: number) {
    return PackageEntity.createQueryBuilder().update({ deleted: false }).where("id = :id", { id }).execute()
  }
}
