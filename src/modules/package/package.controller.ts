import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PackageService } from './package.service';

@Controller('package')
@ApiTags('package')
export class PackageController {
  constructor(private packageService: PackageService) {}

  @Get('/:id')
  async getPackageDetail(@Param('id') id: number) {
    return this.packageService.getPackageDetail(id);
  }

  @Get()
  async getPackages() {
    return this.packageService.getPackages();
  }
}
