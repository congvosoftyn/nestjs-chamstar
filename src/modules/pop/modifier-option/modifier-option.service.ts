import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ModifierOptionEntity } from 'src/entities/ModifierOption.entity';
import { NewModifierOptionDto } from './dto/NewModifierOption.dto';

@Injectable()
export class ModifierOptionService {

    async getModifierOptionById(id: string) {
        // if id = -1 => get all
        let query = await ModifierOptionEntity.createQueryBuilder('mo').where(
            'mo.isActive = true',
        );

        if (id != '-1') {
            // if != -1 => get modifier by id , else get all modifier
            query = query.andWhere('mo.id = :id', { id: Number(id) });
        }
        return await query.getMany();
    }

    async getAllModifierOptionByStoreId(storeId: number) {
        return await ModifierOptionEntity.createQueryBuilder('mo')
            .leftJoin('mo.modifier', 'Modifier')
            .where('mo.isActive = true')
            .andWhere('Modifier.storeId = :storeId', { storeId })
            .orderBy('mo.name', 'ASC')
            .getMany();
    }

    // async addOptionForModifier(request: Request, response: Response, next: NextFunction)
    // {
    //     var optionId = request.body.optionId;
    //     var modifierId = request.body.modifierId;
    //     var {storeId} = response.locals.jwtPayload;
    //     try {
    //             var id = await Modifier.findOne({where:{id:modifierId, storeId:storeId}});
    //             var option = await ModifierOption.findOne({where:{id:optionId, isActive:true}});
    //             option.modifierId = modifierId;

    //             if(id && option)
    //             {

    //                 const {id,modifier,...newOptionProperties} = option;

    //                 var result = await ModifierOption.save(newOptionProperties as ModifierOption);

    //                 return response.status(200).send(result);
    //             }
    //             else{
    //                 return response.status(404).send("OptionId Or ModifierId not found!");
    //             }

    //     } catch (error) {
    //         next(error)
    //     }

    // }

    async newModifierOption(body: NewModifierOptionDto) {
        const modifierOption = body as ModifierOptionEntity;
        const isNew = !modifierOption.id;

        if (!isNew) {
            const old_modifierOption = await ModifierOptionEntity.findOneBy({ id: modifierOption.id });
            if (!old_modifierOption)
                throw new HttpException(`not found with id ${modifierOption.id}`, HttpStatus.NOT_FOUND);
            old_modifierOption.isActive = false;
            await old_modifierOption.save();
        }
        const { id, ...newModifierOptionProperties } = modifierOption; // get all properties of modifier except id if updated, if modifier is complete new then id will be underfined
        // new modifier is always created (also create new one when user wants to update)
        return await ModifierOptionEntity.save(
            newModifierOptionProperties as ModifierOptionEntity,
        );
    }

    async deleteModifierOption(id: number) {
        const delete_modifier_option = await ModifierOptionEntity.findOneBy({ id });
        delete_modifier_option.isActive = false;

        if (delete_modifier_option) {
            return await ModifierOptionEntity.save(delete_modifier_option);
        }
    }

    async getModifierOptionsByModifierId(modifierId: number) {
        let options = await ModifierOptionEntity.createQueryBuilder('mo')
            .where('isActive = true')
            .andWhere('mo.modifierId = :modifierId', { modifierId })
            .orderBy('mo.name', 'ASC')
            .getMany();

        return options;
    }
}
