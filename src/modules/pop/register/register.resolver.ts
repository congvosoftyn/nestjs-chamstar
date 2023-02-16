import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { RegisterEntity } from "src/entities/Register.entity";
import { User } from "src/modules/user/decorators/user.decorator";
import JwtAuthenticationGuard from "src/shared/guards/jwtAuthenticationGuard";
import { RegisterService } from "./register.service";

@Resolver(() => RegisterEntity)
@UseGuards(JwtAuthenticationGuard)
export class RegisterResolver {
    constructor(private readonly registerService: RegisterService) { }

    // @ApiBearerAuth('access-token')
    @Query(()=>RegisterEntity)
    async getRegister(@Args('deviceId',{type:()=>String}) deviceId: string, @User('storeId') storeId: number, @User('userId') userId: number) {
        return this.registerService.getRegister(deviceId, storeId, userId);
    }
}