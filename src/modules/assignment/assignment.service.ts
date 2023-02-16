import { Injectable, NotFoundException } from '@nestjs/common';
import { AssignEntity } from 'src/entities/Assign.entity';
import { AssignmentEntity } from 'src/entities/Assignment.entity';
import { CreateAssignDto } from './dto/CreateAssign.dto';
import { CreateAssignmentDto } from './dto/CreateAssignment.dto';
import { UpdateAssignDto } from './dto/UpdateAssign.dto';

@Injectable()
export class AssignmentService {
  async getAssigns(storeId: number) {
    return await AssignmentEntity.createQueryBuilder('a')
      .leftJoinAndSelect('a.assignments', 'aa')
      .leftJoinAndSelect('aa.waitlist', 'waitlist')
      .where('a.storeId=:storeId', { storeId })
      .andWhere('a.isActive=true')
      .andWhere('aa.timeOut IS NULL')
      .orderBy('a.name', 'ASC');
  }

  async createAssign(body: CreateAssignDto, storeId: number) {
    const assign = body as AssignEntity;

    assign.storeId = storeId;
    assign.isActive = true;
    const isNew = !assign.id;

    if (!isNew) {
      const oldAssign = await AssignmentEntity.findOneBy({ id: assign.id });
      if (!oldAssign) throw new NotFoundException(`${assign.id}`);
    }
    return await AssignEntity.save(assign);
  }

  async deleteAssign(id: number) {
    const delete_assign = await AssignmentEntity.findOneBy({ id });
    delete_assign.isActive = false;

    if (delete_assign) {
      return await AssignmentEntity.save(delete_assign);
    }
  }

  async updateAssign(body: UpdateAssignDto) {
    const assigns = body as AssignEntity[];
    //const currentAssign = await Assign.findOne(assign.id);
    for (const a of assigns) {
      const currentAssign = await AssignEntity.findOneBy({ id: a.id });
      currentAssign.name = a.name;
      currentAssign.height = a.height;
      currentAssign.width = a.width;
      currentAssign.isRect = a.isRect;
      currentAssign.x = a.x;
      currentAssign.y = a.y;
      await currentAssign.save();
    }
    return assigns;
  }

  async createAssignment(assignment: AssignmentEntity) {
    // const assignment = body as AssignmentEntity;
    // Nếu đang có assignment tồn tại với timeOut = NULL (chưa đi)
    // Thì có được add tiếp Assignement không?

    const isNew = !assignment.id;
    if (!isNew) {
      const oldAssignment = await AssignmentEntity.findOneBy({ id: assignment.id });
      if (!oldAssignment) throw new NotFoundException(`${assignment.id}`);
    }

    return await AssignmentEntity.save(assignment);
  }
}
