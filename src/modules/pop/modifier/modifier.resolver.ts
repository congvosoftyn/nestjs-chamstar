import { UseGuards, UsePipes, ValidationPipe, } from "@nestjs/common";
import { Resolver, Query, Args, Int, Mutation } from "@nestjs/graphql";
import { ModifierEntity } from "src/entities/Modifier.entity";
import { User } from "src/modules/user/decorators/user.decorator";
import JwtAuthenticationGuard from "src/shared/guards/jwtAuthenticationGuard";
import { NewModifierInput } from "./dto/NewModifier.input";
import { ModifierService } from "./modifier.service";

@Resolver(() => ModifierEntity)
@UseGuards(JwtAuthenticationGuard)
export class ModifierResolver {
    constructor(private readonly modifierService: ModifierService) { }

    // @ApiBearerAuth('access-token')
    @Query(() => ModifierEntity)
    async getAllModifierByStoreId(@User('storeId') storeId: number) {
        return this.modifierService.getAllModifierByStoreId(storeId);
    }

    // @ApiBearerAuth('access-token')
    @Query(() => ModifierEntity)
    async getModifierById(@Args('id', { type: () => Int }) id: number) {
        return this.modifierService.getModifierById(id);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(() => ModifierEntity)
    @UsePipes(new ValidationPipe())
    async newModifier(@Args('newModifier') newModifier: NewModifierInput, @User('storeId') storeId: number) {
        return this.modifierService.newModifier(newModifier, storeId);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(() => ModifierEntity)
    @UsePipes(new ValidationPipe())
    async updateModifier(@Args('updateModifier') updateModifier: NewModifierInput, @User('storeId') storeId: number) {
        return this.modifierService.newModifier(updateModifier, storeId);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(() => ModifierEntity)
    async deleteModifier(@Args('id',{type:()=>Int}) id: number) {
        return this.modifierService.deleteModifier(id);
    }
}