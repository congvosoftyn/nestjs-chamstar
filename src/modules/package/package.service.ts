import { Injectable } from '@nestjs/common';
import { PackageEntity } from 'src/entities/Package.entity';

@Injectable()
export class PackageService {
  async getPackages() {
    return PackageEntity.find({ relations: ['siteModules'], order: { orderBy: 'ASC' }, });
  }

  async getPackageDetail(packageId: number) {
    return PackageEntity.findOne({ where: { id: packageId }, relations: ['siteModules'], });
  }
}
