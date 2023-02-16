import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreSettingEntity } from 'src/entities/StoreSetting.entity';
import { Repository } from 'typeorm';
import { StoreSettingDto } from './dto/StoreSetting.dto';

@Injectable()
export class SettingService {
    constructor(
        @InjectRepository(StoreSettingEntity)
        private readonly storeSettingRepository: Repository<StoreSettingEntity>
    ) { }

    async getSetting(storeId: number) {
        let setting = await StoreSettingEntity.findOne({ where: { storeId: storeId } });

        if (!setting) {
            const storeSetting = new StoreSettingEntity();
            storeSetting.storeId = storeId;
            await storeSetting.save();
            setting = storeSetting;
        }
        return setting
    }

    async updateSetting(body: StoreSettingDto) {
        const storeSetting = body as StoreSettingEntity;
        await StoreSettingEntity.save(storeSetting);
        return storeSetting
    }
}
