import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PosSettingEntity } from "src/entities/PosSetting.entity";
import { ProductCategoryEntity } from "src/entities/ProductCategory.entity";
import { User } from "src/modules/user/decorators/user.decorator";
import JwtAuthenticationGuard from "src/shared/guards/jwtAuthenticationGuard";
import { UpdateSettingInput } from "./dto/update-setting.input";
import { PosSettingService } from "./pos-setting.service";

@Resolver(() => PosSettingEntity)
@UseGuards(JwtAuthenticationGuard)
export class PosSettingResolver {
    constructor(private posSettingService: PosSettingService) { }

    // @ApiBearerAuth('access-token')
    @Query(() => PosSettingEntity)
    async getAllModifierOptionByStoreId(@User('storeId') storeId: number) {
        return this.posSettingService.getStorePosSettings(storeId);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(() => ProductCategoryEntity)
    @UsePipes(new ValidationPipe())
    async updateSetting(@Args('updateSetting') updateSetting: UpdateSettingInput) {
        return this.posSettingService.updateSetting(updateSetting as PosSettingEntity);
    }
}