import { Module } from '@nestjs/common';
import { AddonService } from './addon.service';
import { AddonController } from './addon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddonEntity } from 'src/entities/Addon.entity';
import { BillingEntity } from 'src/entities/Billing.entity';
import { CompanyEntity } from 'src/entities/Company.entity';
import { PackageAddonEntity } from 'src/entities/PackageAddon.entity';
import { PaymentEntity } from 'src/entities/Payment.entity';
import { AddonResolver } from './addon.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([AddonEntity, BillingEntity, CompanyEntity, PackageAddonEntity, PaymentEntity]),
  ],
  providers: [AddonService, AddonResolver],
  controllers: [AddonController]
})
export class AddonModule {}
