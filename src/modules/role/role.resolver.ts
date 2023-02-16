import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { RoleEntity } from "src/entities/Role.entity";
import JwtAuthenticationGuard from "src/shared/guards/jwtAuthenticationGuard";
import { User } from "../user/decorators/user.decorator";
import { FindRoleInput } from "./dto/FindRole.input";
import { SaveRoleInput } from "./dto/SaveRole.input";
import { RoleService } from "./role.service";

@Resolver(() => RoleEntity)
@UseGuards(JwtAuthenticationGuard)
export class RoleResolver {
    constructor(private roleService: RoleService) { }

    // @ApiBearerAuth('access-token')
    @Query(() => RoleEntity)
    async getRoles(@User('companyId') companyId: number) {
        return this.roleService.getRoles(companyId);
    }

    // @ApiBearerAuth('access-token')
    @Query(() => RoleEntity, { name: 'findRoles' })
    @UsePipes(new ValidationPipe())
    async findRole(@Args('_findRoleDto') _findRoleDto: FindRoleInput, @User('companyId') companyId: number) {
        return this.roleService.findRole(_findRoleDto, companyId);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(() => RoleEntity)
    @UsePipes(new ValidationPipe())
    async updateSaveRole(@Args('updateRole') updateRole: SaveRoleInput, @User('companyId') companyId: number) {
        return this.roleService.saveRole(updateRole, companyId);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(() => RoleEntity)
    @UsePipes(new ValidationPipe())
    async newSaveRole(@Args('newSaveRole') newSaveRole: SaveRoleInput, @User('companyId') companyId: number) {
        return this.roleService.saveRole(newSaveRole, companyId);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(() => RoleEntity)
    async deleteRole(@Args('id', { type: () => Int }) id: number) {
        return this.roleService.deleteRole(id);
    }
}