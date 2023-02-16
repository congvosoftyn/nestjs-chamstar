import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { URLShortenEntity } from 'src/entities/URLShorten.entity';
import { customAlphabet } from 'nanoid'
import { MAIN_URL } from 'src/config';
@Injectable()
export class UrlshortenService {

    hello(res: Response) {
        res.send({ hello: 'hi' })
    }

    getURL = async (urlCode: string, res: Response) => {

        const item = await URLShortenEntity.findOneBy({ urlCode: urlCode });
        if (item) {
            return res.redirect(item.originalUrl);
        } else {
            return res.redirect(MAIN_URL);
        }
    }

    static async addURL(originalUrl: string) {
        const nanoid = customAlphabet('1234567890abcdef', 10)
        const urlCode = nanoid();

        const updatedAt = new Date();
        //   if (validUrl.isUri(originalUrl)) {
        try {
            const item = await URLShortenEntity.findOneBy({ originalUrl: originalUrl });
            if (item) {
                return item;
            } else {
                let shortUrl = process.env.API_URL + "/s/" + urlCode;
                const item = new URLShortenEntity();
                item.originalUrl = originalUrl;
                item.shortUrl = shortUrl;
                item.urlCode = urlCode;
                item.updatedAt = updatedAt;
                await item.save();
                return item;
            }
        } catch (err) {
            console.log("Invalid User Id");
        }
    }
}
