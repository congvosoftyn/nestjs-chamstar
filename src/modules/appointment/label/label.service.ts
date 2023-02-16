import { Injectable } from '@nestjs/common';
import { AppointmentLabelEntity } from 'src/entities/AppointmentLabel.entity';
import { CreateLabelDto } from './dto/create-label.dto';

@Injectable()
export class LabelService {
  getLabels(storeId: number) {
    return AppointmentLabelEntity.createQueryBuilder('label')
    .where('label.storeId = :storeId and label.isActive = true', { storeId })
    .orderBy("label.id","ASC")
    .getMany()
  }

  async createLabel(label: CreateLabelDto, storeId: number) {
    const _label = label as AppointmentLabelEntity;
    _label.storeId = storeId;
    return await AppointmentLabelEntity.save(_label);
  }

  async updateLabel(id: number, label: CreateLabelDto, storeId: number) {
    const _label = label as AppointmentLabelEntity;
    _label.storeId = storeId;
    return AppointmentLabelEntity.update(id, label);
  }

  async deleteLabel(id: number, storeId: number) {
    await AppointmentLabelEntity.createQueryBuilder().update().set({ isActive: false })
      .where(`id = :id AND storeId = :storeId AND isEditable = true`, { id, storeId, }).execute();

    return await AppointmentLabelEntity.findOneBy({ id });
  }
}
