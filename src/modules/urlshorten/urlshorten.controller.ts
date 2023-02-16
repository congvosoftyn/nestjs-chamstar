import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UrlshortenService } from './urlshorten.service';

@Controller('s')
@ApiTags('s')
export class SController {
    constructor(private urlshortenService: UrlshortenService) { }

    @Get('/:code')
    async getURL(@Param('code') code: string, @Res() res: Response) {
        return this.urlshortenService.getURL(code, res);
    }

    @Get()
    async hello(@Res() res: Response) {
        return this.urlshortenService.hello(res);
    }
}
