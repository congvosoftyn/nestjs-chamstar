import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { NewTaxDto } from './dto/NewTax.dto';
import { TaxService } from './tax.service';

@Controller('pop/tax')
@ApiTags('pop/tax')
export class TaxController {
    constructor(private readonly taxService: TaxService) { }

    @Get()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async getAllTax(@User('storeId') storeId: number) {
        return this.taxService.getAllTax(storeId);
    }

    @Post()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async newTax(@Body() body: NewTaxDto, @User('storeId') storeId: number) {
        return this.taxService.newTax(body, storeId);
    }

    @Put()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async updateTax(@Body() body: NewTaxDto, @User('storeId') storeId: number) {
        return this.taxService.newTax(body, storeId);
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async deleteTax(@Param('id') id: number) {
        return this.taxService.deleteTax(id);
    }
}
