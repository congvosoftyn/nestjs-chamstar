import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { CustomerFollowingEntity } from 'src/entities/CustomerFollowing.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CustomerEntity, CustomerFollowingEntity]),],
    providers: [CustomersService],
    exports: [CustomersService],
})
export class CustomersModule { }
