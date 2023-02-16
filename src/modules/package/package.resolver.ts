import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { PackageEntity } from 'src/entities/Package.entity';
import { PackageService } from './package.service';

@Resolver(() => PackageEntity)
export class PackageResolver {
  constructor(private packageService: PackageService) {}

  @Query(() => PackageEntity)
  async getPackageDetail(@Args('id', { type: () => Int }) id: number) {
    return this.packageService.getPackageDetail(id);
  }

  @Query(() => PackageEntity)
  async getPackages() {
    return this.packageService.getPackages();
  }
}
