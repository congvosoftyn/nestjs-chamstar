import { Injectable } from '@nestjs/common';
import { PermissionEntity } from 'src/entities/Permission.entity';
import { RoleEntity } from 'src/entities/Role.entity';
import { FindRoleDto } from './dto/FindRole.dto';
import { SaveRoleDto } from './dto/SaveRole.dto';

@Injectable()
export class RoleService {
    async getRoles(companyId: number) {
        // const roleIds: number[] = res.locals.jwtPayload.roleIds;
        // console.log(roleIds);
        // if(!roleIds) {
        //     res.status(404).send({message: 'no role found'});
        //     return;
        // }
        return await RoleEntity.find({ where: { companyId } });
        // const roles = await Role.createQueryBuilder("role")
        // .where("role.id IN (:...roleIds)", {roleIds}).getMany();
    }

    async findRole(_findRoleDto: FindRoleDto, companyId: number) {
        const skip = _findRoleDto.pageNumber;
        const take = _findRoleDto.pageNumber;
        const sortField = _findRoleDto.pageNumber;
        const sortOrder = _findRoleDto.sortOrder == 'asc' ? 'ASC' : 'DESC';
        const search = _findRoleDto.filter;

        let query = await RoleEntity
            .createQueryBuilder("role")
            .where("role.companyId = :companyId", { companyId })
            .andWhere(`(role.name LIKE :keywork)`, { keywork: `%${search}%` })
            .take(take)
            .skip(skip);

        if (sortField) {
            query.orderBy("role." + sortField, sortOrder)
        }
        const roles = await query.getManyAndCount();
        return roles.reduce((result, item, index, array) => {
            if (index == 0) {
                result['items'] = item;
            } else {
                result['totalCount'] = item;
            }
            return result
        }, {});
    }

    async saveRole(body: SaveRoleDto, companyId: number) {
        const role = body as RoleEntity;
        const permissions = await PermissionEntity.findByIds(role.permissionIds);
        role.permissions = permissions;
        role.companyId = companyId;
        await RoleEntity.save(role);
        return role;
    }

    async deleteRole(roleId: number) {
        await RoleEntity.delete(roleId);;
        return { message: 'deleted' };
    }
}
