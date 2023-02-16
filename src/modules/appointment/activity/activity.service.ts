import { Injectable } from '@nestjs/common';
import { AppointmentActivityEntity } from 'src/entities/AppointmentActivity.entity';

@Injectable()
export class ActivityService {
    async getActivity(page: number, storeId: number) {
        const size = 20;
        const skip = size * page;

        return await AppointmentActivityEntity.find({ where: { storeId: 16 }, order: { created: 'DESC' }, take: size, skip, relations: ['booking'] });
    }

    async unread(storeId: number) {
        const activity: number = await AppointmentActivityEntity.count({ where: { storeId, read: false } })
        return { count: activity };
    }

    async readall(storeId: number) {
        const result = await AppointmentActivityEntity.createQueryBuilder()
            .update()
            .set({ read: true })
            .where(`storeId = :storeId AND read = false`, { storeId })
            .execute();

        return { affected: result.affected }
    }

    async delete(id: number) {
        return await AppointmentActivityEntity.delete(id);
    }
}
