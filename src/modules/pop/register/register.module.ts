import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterEntity } from 'src/entities/Register.entity';
import { RegisterResolver } from './register.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([RegisterEntity])],
  providers: [RegisterService,RegisterResolver],
  controllers: [RegisterController]
})
export class RegisterModule { }