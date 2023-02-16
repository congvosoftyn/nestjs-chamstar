import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ModifierEntity } from 'src/entities/Modifier.entity';
import { ModifierOptionEntity } from 'src/entities/ModifierOption.entity';
import { NewModifierDto } from './dto/NewModifier.dto';

@Injectable()
export class ModifierService {
    async getModifierById(id: number) {
        // if id = -1 => get all

        let query = await ModifierEntity.createQueryBuilder('m')
            .leftJoinAndSelect('m.modifierOptions', 'ModifierOptions')
            .andWhere('ModifierOptions.isActive = true');

        if (id.toString() != '-1') // if != -1 => get modifier by id , else get all modifier
        {
            query = query.andWhere('m.id = :id', { id });
        }
        return await query.getOne();

    }

    async getAllModifierByStoreId(storeId: number) {
        return await ModifierEntity.createQueryBuilder('m')
            .leftJoinAndSelect('m.modifierOptions', 'ModifierOptions')
            .leftJoinAndSelect('m.products', 'modifierProduct')
            .andWhere('m.isActive = 1')
            .andWhere('m.storeId = :storeId', { storeId })
            .orderBy('m.name', 'ASC')
            .getMany();
    }

    async newModifier(body: NewModifierDto, storeId: number) {
        const modifier = body as ModifierEntity;
        const isNew = !modifier.id;
        modifier.storeId = storeId;

        if (!isNew) {
            const old_modifier = await ModifierEntity.findOneBy({ id: modifier.id });
            if (!old_modifier) throw new HttpException(`not found with id ${modifier.id}`, HttpStatus.NOT_FOUND);
            old_modifier.isActive = false;
            await old_modifier.save();
        }
        const { id, ...newModifierProperties } = modifier; // get all properties of modifier except id if updated, if modifier is complete new then id will be underfined
        // new modifier is always created (also create new one when user wants to update)
        const newModifier = await ModifierEntity.save(newModifierProperties as ModifierEntity);
        newModifier.modifierOptions.map(e => e.modifierId = newModifier.id);
        await ModifierOptionEntity.save(newModifier.modifierOptions);
        return newModifier;
    }

    async deleteModifier(id: number) {
        const delete_modifier = await ModifierEntity.findOneBy({ id });
        delete_modifier.isActive = false;

        if (delete_modifier) {
            return await ModifierEntity.save(delete_modifier);
        }
    }
}
