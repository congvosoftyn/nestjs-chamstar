import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { User } from '../user/decorators/user.decorator';
import { AddCustomerGroupDto } from './dto/AddCustomerGroup.dto';
import { AddGroupDto } from './dto/AddGroup.dto';
import { GroupService } from './group.service';

@Controller('group')
@ApiTags('group')
export class GroupController {
    constructor(private groupService: GroupService) { }

    @Post()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async addGroup(@Body() body: AddGroupDto, @User('companyId') companyId: number) {
        return this.groupService.addGroup(body, companyId);
    }

    @Get()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getGroups(@User('companyId') companyId: number) {
        return this.groupService.getGroups(companyId);
    }

    @Get('/groupforPromo')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getGroupForPromo(@User('companyId') companyId: number, @User('storeId') storeId: number) {
        return this.groupService.getGroupForPromo(companyId, storeId);
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async deleteGroup(@Param('id') id: number) {
        return this.groupService.deleteGroup(id);
    }

    @Post('/addCustomer')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async addCustomerGroup(@Body() body: AddCustomerGroupDto) {
        return this.groupService.addCustomerGroup(body);
    }


    @Delete('removeCustomer')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async removeCustomerGroup(@Body() body: AddGroupDto, @Query('customerId') customerId: number, @Query('groupId') groupId: number) {
        return this.groupService.removeCustomerGroup(customerId, groupId, body);
    }

}
