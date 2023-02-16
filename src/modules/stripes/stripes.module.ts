import { Module } from '@nestjs/common';
import { StripesService } from './stripes.service';
import { StripeModule } from 'nestjs-stripe';
import { STRIPE_SECRET } from 'src/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/User.entity';
import { CompanyEntity } from 'src/entities/Company.entity';

@Module({
  imports: [
    StripeModule.forRoot({
      apiKey: STRIPE_SECRET,
      apiVersion: '2020-08-27',
      typescript: true
    }),
    TypeOrmModule.forFeature([CompanyEntity, UserEntity])
  ],
  providers: [StripesService],
  exports: [StripesService]
})
export class StripesModule { }
