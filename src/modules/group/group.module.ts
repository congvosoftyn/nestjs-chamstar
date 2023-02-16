import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckInEntity } from 'src/entities/CheckIn.entity';
import { CustomerGroupEntity } from 'src/entities/CustomerGroup.entity';
import { CompanyCustomerEntity } from 'src/entities/CompanyCustomer.entity';
import { GroupResolver } from './group.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CheckInEntity, CustomerGroupEntity, CompanyCustomerEntity]),],
  providers: [GroupService, GroupResolver],
  controllers: [GroupController]
})
export class GroupModule { }
