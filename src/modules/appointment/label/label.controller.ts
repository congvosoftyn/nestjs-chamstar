import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppointmentLabelEntity } from 'src/entities/AppointmentLabel.entity';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { CreateLabelDto } from './dto/create-label.dto';
import { LabelService } from './label.service';

@Controller('appointment/label')
@ApiTags('appointment/label')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class LabelController {
    constructor(private readonly labelService: LabelService) { }

    @Get()
    async getLabels(@User('storeId') storeId: number) {
        return this.labelService.getLabels(storeId);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async createLabel(@Body() label: CreateLabelDto, @User('storeId') storeId: number) {
        return this.labelService.createLabel(label, storeId);
    }

    @Put('/:id')
    @UsePipes(new ValidationPipe())
    async updateLabel(@Param('id') id: number, @Body() label: CreateLabelDto, @User('storeId') storeId: number) {
        return this.labelService.updateLabel(id, label, storeId);
    }

    @Delete(':id')
    async deleteLabel(@Param('id') id: number, @User('storeId') storeId: number) {
        return this.labelService.deleteLabel(id, storeId);
    }
}
