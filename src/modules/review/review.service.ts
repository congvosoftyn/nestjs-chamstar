import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CompanyEntity } from 'src/entities/Company.entity';
import { ReviewEntity } from 'src/entities/Review.entity';
import { EmailService } from '../email/email.service';
import * as jwt from 'jsonwebtoken';
import { LIFE_SECRET } from 'src/config';
import { CheckInEntity } from 'src/entities/CheckIn.entity';
import { MessageSentEntity } from 'src/entities/MessageSent.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import { UserEntity } from 'src/entities/User.entity';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { AddMoodDto } from './dto/AddMood.dto';
import { Response } from 'express';
import { MessageStatusDto } from './dto/MessageStatus.dto';
import { UpdateReviewDto } from './dto/UpdateReview.dto';

@Injectable()
export class ReviewService {
    constructor(private emailService: EmailService) { }

    async getReviews(page: number, storeId: number) {
        const size = 20;
        const skip = size * page;
        return await ReviewEntity.find({
            where: { storeId },
            order: { created: 'DESC' },
            take: size,
            skip,
            relations: ['customer']
        });

    }
    async getCompanyData(token: string,) {
        const decoded: any = jwt.verify(token.toString(), LIFE_SECRET);
        const companyId = decoded.companyId;
        const customerId = decoded.customerId;
        if (companyId) {
            // const company = await Company.findOne({where: {id:companyId}, relations: ['companySetting']})
            return await CompanyEntity.createQueryBuilder('c')
                .select('c.name')
                .leftJoinAndSelect('c.companySetting', 's').where({ id: companyId }).getOne()

        } else {
            throw new NotFoundException();
        }
    }

    async getStoreData(checkinString: string) {
        const checkin = await CheckInEntity.findOne({ where: { stringId: checkinString }, relations: ['store', 'store.storeSetting'] });
        if (checkin)
            return checkin;
        else throw new NotFoundException();

    }

    async messageStatus(body: MessageStatusDto):Promise<{status:number}> {
        const messageSid = body.MessageSid;
        const messageStatus = body.MessageStatus;
        const message = await MessageSentEntity.findOneBy({ messageId: messageSid });
        if (message) {
            message.status = messageStatus;
            await message.save();
        }
        console.log(`SID: ${messageSid}, Status: ${messageStatus}`);
        return {status: HttpStatus.OK}
    }

    addMood = async (_body: AddMoodDto) => {
        const checkinID = _body.id;
        const checkin = await CheckInEntity.findOne({ where: { stringId: checkinID.toString() }, relations: ['companyCustomer', 'companyCustomer.customer'] });
        const mood = _body.mood;
        const _checkReview = await ReviewEntity.findOne({ where: { checkInId: checkin.id } });
        if (!_checkReview) {

            const review = new ReviewEntity();
            review.customerId = checkin.companyCustomer.customerId;
            review.customerName = checkin.companyCustomer.customer.getFullName();
            review.storeId = checkin.storeId;
            review.checkInId = checkin.id
            if (mood == 'good') {
                review.isHappy = true;
                review.rate = 5;
            } else {
                review.isHappy = false;
                review.rate = 1;
                this.sendStoreAttention(review);
            }
            await review.save();
            return review;
        } else {
            _checkReview.isHappy = mood == 'good' ? true : false;
            if (mood == 'bad') {
                this.sendStoreAttention(_checkReview);
            }
            await _checkReview.save();
            return _checkReview;
        }
    }

    updateReview = async (body: UpdateReviewDto) => {
        const reviewId = body.id;
        if (reviewId) {
            const review = await ReviewEntity.findOneBy({id: reviewId})
            const customerName = body.name;
            const rate = body.rate;
            const comment = body.comment;
            review.customerName = customerName;
            review.rate = rate;
            review.comments = comment;
            if (rate < 4) {
                this.sendStoreAttention(review);
            }
            await review.save();
            return review;
        } else {
            const review = body as unknown as ReviewEntity;
            return ReviewEntity.save(review);
        }
    }

    async sendStoreAttention(review: ReviewEntity) {
        const store = await StoreEntity.findOne({ where: { id: review.storeId } });
        const user = await UserEntity.findOneBy({ companyId: store.companyId });
        const customer = await CustomerEntity.findOneBy({id: review.customerId});
        this.emailService.badReview(user.email, customer.phoneNumber, review.comments)
    }
}
