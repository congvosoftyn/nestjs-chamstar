import { Injectable } from '@nestjs/common';
import { PrivateChatEntity } from 'src/entities/PrivateChat.entity';

@Injectable()
export class ChatService {
    async getPrivateDetail(fromCustomer: number, toCustomer: number, start: number, count: number) {
        return await PrivateChatEntity
            .createQueryBuilder('p')
            .innerJoinAndSelect("p.fromCustomer", "fromCustomer")
            .innerJoinAndSelect("p.toCustomer", "toCustomer")
            .where("p.fromCustomerId = :fromCustomer AND p.toCustomerId = :toCustomerId", { fromCustomer, toCustomer })
            .orWhere("p.fromCustomerId = :toCustomer AND p.toCustomerId = :fromCustomer", { toCustomer, fromCustomer })
            .limit(count)
            .offset(start).getMany();
    }

    async savePrivateMsg({ fromCustomerId, toCustomerId, message, attachments }) {
        let privateChat = new PrivateChatEntity();
        privateChat.fromCustomerId = fromCustomerId;
        privateChat.toCustomerId = toCustomerId;
        privateChat.message = message;
        privateChat.attachments = attachments;
        return await privateChat.save();
    }

    async getUnreadCount({ sortTime, fromCustomerId, toCustomerId }) {

        return await PrivateChatEntity
            .createQueryBuilder('p')
            .select('COUNT(p.created) as unread')
            .where("p.created > :sortTime", { sortTime })
            .andWhere("(p.fromCustomerId = :fromCustomerId AND p.toCustomerId = :toCustomerId)", { fromCustomerId, toCustomerId })
            .getRawOne();
    }


}
