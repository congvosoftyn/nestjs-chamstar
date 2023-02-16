import { Injectable } from '@nestjs/common';
import { PermissionEntity } from 'src/entities/Permission.entity';

@Injectable()
export class PermissionService {
  allPermissions() {
    return PermissionEntity.find();
  }

  async getPermissions(roleIds: number) {
    return PermissionEntity.createQueryBuilder('permission')
      .leftJoin('permission.roles', 'role')
      .where('role.id IN (:roleIds)', { roleIds });
  }
}
