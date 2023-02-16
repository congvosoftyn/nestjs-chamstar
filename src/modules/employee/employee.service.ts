import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeEntity } from 'src/entities/Employee.entity';
import { NewEmployeeDto } from './dto/NewEmployee.dto';

@Injectable()
export class EmployeeService {
  async newEmployee(body: NewEmployeeDto, storeId: number) {
    // new and update
    const employee = body as unknown as EmployeeEntity;
    employee.storeId = storeId;
    if (employee.id) {
      // new
      const old_employee = await EmployeeEntity.findOneBy({ id: employee.id });
      if (!old_employee) throw new NotFoundException(`${old_employee.id}`);
      old_employee.isActive = false;
      await old_employee.save();
    }

    const { id, ...newEmployeeProperties } = employee;
    const newEmployee = await EmployeeEntity.save(
      newEmployeeProperties as EmployeeEntity,
    );
    return EmployeeEntity.save(newEmployee);
  }

  async getAllEmployee(storeId: number) {
    return EmployeeEntity.createQueryBuilder()
      .where('storeId = :storeId and isActive = true', { storeId })
      .getMany();
  }

  async deleteEmployee(id: number) {
    return EmployeeEntity.createQueryBuilder().update({ isActive: false }).where("id = :id", { id }).execute()
  }
}
