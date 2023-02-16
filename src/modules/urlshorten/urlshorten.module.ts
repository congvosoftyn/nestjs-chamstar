import { Module } from '@nestjs/common';
import { UrlshortenService } from './urlshorten.service';
import { SController } from './urlshorten.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { URLShortenEntity } from 'src/entities/URLShorten.entity';
import { SResolver } from './urlshorten.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([URLShortenEntity])],
  providers: [UrlshortenService, SResolver],
  controllers: [SController]
})
export class UrlshortenModule { }
