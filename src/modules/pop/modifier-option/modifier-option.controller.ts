import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { NewModifierOptionDto } from './dto/NewModifierOption.dto';
import { ModifierOptionService } from './modifier-option.service';

@Controller('pop/modifier-option')
@ApiTags('pop/modifier-option')
export class ModifierOptionController {
    constructor(private readonly modifierOptionService: ModifierOptionService) { }

    @Get()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getAllModifierOptionByStoreId(@User('storeId') storeId: number) {
        return this.modifierOptionService.getAllModifierOptionByStoreId(storeId);
    }

    @Get(':id')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getModifierOptionById(@Param('id') id: string) {
        return this.modifierOptionService.getModifierOptionById(id);
    }

    @Post()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async newModifierOption(@Body() body: NewModifierOptionDto) {
        return this.modifierOptionService.newModifierOption(body);
    }

    @Put()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async updateModifierOption(@Body() body: NewModifierOptionDto) {
        return this.modifierOptionService.newModifierOption(body);
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async deleteModifierOption(@Param('id') id: number) {
        return this.modifierOptionService.deleteModifierOption(id);
    }
}
