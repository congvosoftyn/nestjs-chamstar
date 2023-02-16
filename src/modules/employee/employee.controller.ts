import { Body, Controller, Delete, Get, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { User } from '../user/decorators/user.decorator';
import { NewEmployeeDto } from './dto/NewEmployee.dto';
import { EmployeeService } from './employee.service';

@Controller('employee')
@ApiTags('employee')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class EmployeeController {
    constructor(private employeeService: EmployeeService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    newEmployee(@Body() body: NewEmployeeDto, @User('storeId') storeId: number) {
        return this.employeeService.newEmployee(body, storeId)
    }

    @Delete()
    deleteEmployee(@Query('id') id: number) {
        return this.employeeService.deleteEmployee(id)
    }

    @Get()
    getAllEmployee(@User('storeId') storeId: number) {
        return this.employeeService.getAllEmployee(storeId)
    }
}
