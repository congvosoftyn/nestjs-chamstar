import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AssignmentEntity } from 'src/entities/Assignment.entity';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { User } from '../user/decorators/user.decorator';
import { AssignmentService } from './assignment.service';
import { CreateAssignDto } from './dto/CreateAssign.dto';
import { UpdateAssignDto } from './dto/UpdateAssign.dto';

@Controller('assign')
@ApiTags('assign')
export class AssignmentController {
  constructor(private assignmentService: AssignmentService) { }

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  async getAssigns(@User('storeId') storeId: number) {
    return this.assignmentService.getAssigns(storeId)
  }

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async createAssign(@Body() body: CreateAssignDto, @User('storeId') storeId: number) {
    return this.assignmentService.createAssign(body, storeId)
  }

  @Put()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async updateAssign(@Body() body: UpdateAssignDto) {
    return this.assignmentService.updateAssign(body)
  }

  @Delete('/:id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  async deleteAssign(@Param('id') id: number) {
    return this.assignmentService.deleteAssign(id)
  }

  //Assignment
  @Post('/assignment')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async createAssignment(@Body() body: AssignmentEntity) {
    return this.assignmentService.createAssignment(body);
  }
}
