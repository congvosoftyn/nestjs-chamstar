import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { CustomerEntity } from 'src/entities/Customer.entity';
import TextMessage from 'src/shared/utils/Message';
import * as jwt from 'jsonwebtoken';
import { RequestCodeDto } from './dto/RequestCode.dto';
import { VerifyCodeDto } from './dto/VerifyCode.dto';
import { LIFE_SECRET } from 'src/config';
import { ResendCodeDto } from './dto/ResendCode.dto';

@Injectable()
export class PhoneVerifyService {
    requestCode(body: RequestCodeDto, res: Response) {
        const smsVerify = new TextMessage();
        const phone = body.phone;
        const countryCode = body.code;

        if (phone == null) {
            throw new HttpException('Phone is required.', HttpStatus.INTERNAL_SERVER_ERROR)
        }

        smsVerify.requestCode(countryCode + phone);
        res.send({ success: true, time: smsVerify.getExpiration() });
    }

    async verifyCode(body: VerifyCodeDto, res: Response) {

        const phone = body.phone;
        const countryCode = body.code;
        const smsMessage = body.smsMessage;
        if (phone == null || smsMessage == null) {
            throw new HttpException('Both phone and smsMessage are required.', HttpStatus.INTERNAL_SERVER_ERROR)
        }

        const smsVerify = new TextMessage();
        const isSuccessful = smsVerify.verifyCode(countryCode + phone, smsMessage);
        if (isSuccessful) {
            let customer = await CustomerEntity.findOneBy({ phoneNumber: phone });
            if (!customer) {
                customer = new CustomerEntity();
                customer.phoneNumber = phone;
                customer.countryCode = countryCode;
            }
            customer.verified = true;
            await customer.save();
            const token = jwt.sign({ customerId: customer.id }, LIFE_SECRET, { expiresIn: '10 days' });
            res.setHeader("token", token);
            res.send({ success: true, customer, token });
        } else {
            return { success: false, message: 'Unable to validate code for this phone number' };
        }
    }

    resendCode(body: ResendCodeDto) {
        const smsVerify = new TextMessage();
        const phone = body.phone;
        const countryCode = body.code;

        if (phone == null) {
            throw new HttpException('Phone is required.', HttpStatus.INTERNAL_SERVER_ERROR)
        }

        smsVerify.resentCode(countryCode + phone);
        return { success: true, time: smsVerify.getExpiration() };
    }
}
