import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { CustomerFollowingEntity } from 'src/entities/CustomerFollowing.entity';
import { ClientResolver } from './client.resolver';
@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity, CustomerFollowingEntity]),
  ],
  providers: [ClientService, ClientResolver],
  controllers: [ClientController],
})

export class ClientModule {}