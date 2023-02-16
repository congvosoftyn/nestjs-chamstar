import { Injectable } from '@nestjs/common';
import { PosSettingEntity } from 'src/entities/PosSetting.entity';

@Injectable()
export class PosSettingService {

    async getStorePosSettings(storeId: number) {
        let setting = await PosSettingEntity.createQueryBuilder('posSetting')
            // .leftJoinAndSelect('posSetting.taxes','taxes')
            // .leftJoinAndSelect('taxes.products','products','products.isActive = true') 
            .where({ storeId })
            .getOne()
        if (!setting) { // if store first created then generate default setting
            const posSetting = new PosSettingEntity();
            posSetting.storeId = storeId;
            await posSetting.save();
            //    posSetting.giftCardQuickAmountsList = posSetting.stringAmountsToList(posSetting.giftCardQuickAmounts)
            return posSetting;
        }
        return setting;
    }

    async updateSetting(_newSetting: PosSettingEntity) {
        await PosSettingEntity.save(_newSetting)
        return _newSetting;
    }
}
