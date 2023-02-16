import { Injectable } from '@nestjs/common';
import { RegisterEntity } from 'src/entities/Register.entity';

@Injectable()
export class RegisterService {

    async getRegister(deviceId: string, storeId: number, userId: number) {
        let register = await RegisterEntity.findOne({ where: { storeId, userId, deviceId } });
        if (!register) {
            register = new RegisterEntity();
            register.deviceId = deviceId as string;
            register.userId = userId;
            register.storeId = storeId;
            await register.save();
        }
        return register;
    }
}
