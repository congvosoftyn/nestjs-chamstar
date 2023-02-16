import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ModifierOptionEntity } from "src/entities/ModifierOption.entity";
import { User } from "src/modules/user/decorators/user.decorator";
import JwtAuthenticationGuard from "src/shared/guards/jwtAuthenticationGuard";
import { NewModifierOptionInput } from "./dto/NewModifierOption.input";
import { ModifierOptionService } from "./modifier-option.service";

@Resolver(() => ModifierOptionEntity)
@UseGuards(JwtAuthenticationGuard)
export class ModifierOptionResolver {
    constructor(private readonly modifierOptionService: ModifierOptionService) { }

    // @ApiBearerAuth('access-token')
    @Query(() => ModifierOptionEntity)
    async getAllModifierOptionByStoreId(@User('storeId') storeId: number) {
        return this.modifierOptionService.getAllModifierOptionByStoreId(storeId);
    }

    // @ApiBearerAuth('access-token')
    @Query(() => ModifierOptionEntity)
    async getModifierOptionById(@Args('id', { type: () => Int }) id: string) {
        return this.modifierOptionService.getModifierOptionById(id);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(() => ModifierOptionEntity)
    @UsePipes(new ValidationPipe())
    async newModifierOption(@Args('newModifierOption') newModifierOption: NewModifierOptionInput) {
        return this.modifierOptionService.newModifierOption(newModifierOption);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(() => ModifierOptionEntity)
    @UsePipes(new ValidationPipe())
    async updateModifierOption(@Args('updateModifierOption') updateModifierOption: NewModifierOptionInput) {
        return this.modifierOptionService.newModifierOption(updateModifierOption);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(() => ModifierOptionEntity)
    async deleteModifierOption(@Args('id', { type: () => Int }) id: number) {
        return this.modifierOptionService.deleteModifierOption(id);
    }
}