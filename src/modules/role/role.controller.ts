import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { User } from '../user/decorators/user.decorator';
import { FindRoleDto } from './dto/FindRole.dto';
import { SaveRoleDto } from './dto/SaveRole.dto';
import { RoleService } from './role.service';

@Controller('role')
@ApiTags('role')
export class RoleController {
    constructor(private roleService: RoleService) { }

    @Get()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getRoles(@User('companyId') companyId: number) {
        return this.roleService.getRoles(companyId);
    }

    @Get('/findRoles')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async findRole(@Query() _findRoleDto: FindRoleDto, @User('companyId') companyId: number) {
        return this.roleService.findRole(_findRoleDto, companyId);
    }

    @Put()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async updateSaveRole(@Body() body: SaveRoleDto, @User('companyId') companyId: number) {
        return this.roleService.saveRole(body, companyId);
    }


    @Post()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async newSaveRole(@Body() body: SaveRoleDto, @User('companyId') companyId: number) {
        return this.roleService.saveRole(body, companyId);
    }


    @Delete('/:id')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async deleteRole(@Param('id') id: number) {
        return this.roleService.deleteRole(id);
    }

}
