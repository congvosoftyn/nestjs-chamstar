import { Res } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { UrlshortenService } from "./urlshorten.service";
import {Response} from 'express'
import { URLShortenEntity } from "src/entities/URLShorten.entity";

@Resolver(() => URLShortenEntity)
export class SResolver {
    constructor(private urlshortenService: UrlshortenService) { }

    // @Get('/:code')
    @Query(()=>URLShortenEntity)
    async getURL(@Args('code',{type:()=>String}) code: string, @Res() res: Response) {
        return this.urlshortenService.getURL(code, res);
    }

    @Query(()=>URLShortenEntity)
    async hello(@Res() res: Response) {
        return this.urlshortenService.hello(res);
    }
}