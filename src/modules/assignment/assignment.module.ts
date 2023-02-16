import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignEntity } from 'src/entities/Assign.entity';
import { AssignmentEntity } from 'src/entities/Assignment.entity';
import { AssignmentResolver } from './assignment.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([AssignEntity, AssignmentEntity])],
  providers: [AssignmentService, AssignmentResolver],
  controllers: [AssignmentController],
})
export class AssignmentModule { }
