import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { NewModifierDto } from './dto/NewModifier.dto';
import { ModifierService } from './modifier.service';

@Controller('pop/modifier')
@ApiTags('pop/modifier')
export class ModifierController {
    constructor(private readonly modifierService: ModifierService) { }

    @Get()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getAllModifierByStoreId(@User('storeId') storeId: number) {
        return this.modifierService.getAllModifierByStoreId(storeId);
    }

    @Get(':id')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getModifierById(@Param('id') id: number) {
        return this.modifierService.getModifierById(id);
    }

    @Post()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async newModifier(@Body() body: NewModifierDto, @User('storeId') storeId: number) {
        return this.modifierService.newModifier(body, storeId);
    }

    @Put()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async updateModifier(@Body() body: NewModifierDto, @User('storeId') storeId: number) {
        return this.modifierService.newModifier(body, storeId);
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async deleteModifier(@Param('id') id: number) {
        return this.modifierService.deleteModifier(id);
    }

}
