import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { StoreSettingEntity } from "src/entities/StoreSetting.entity";
import JwtAuthenticationGuard from "src/shared/guards/jwtAuthenticationGuard";
import { User } from "../user/decorators/user.decorator";
import { StoreSettingDto } from "./dto/StoreSetting.dto";
import { StoreSettingInput } from "./dto/StoreSetting.input";
import { SettingService } from "./setting.service";

@Resolver(() => StoreSettingEntity)
@UseGuards(JwtAuthenticationGuard)
export class SettingResolver {
    constructor(private settingService: SettingService) { }

    // @ApiBearerAuth('access-token')
    @Query(()=>StoreSettingEntity)
    async getSetting(@User('storeId') storeId: number) {
        return this.settingService.getSetting(storeId);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(()=>StoreSettingEntity)
    async updateSetting(@Args('updateSetting') updateSetting: StoreSettingInput) {
        return this.settingService.updateSetting(updateSetting);
    }
}