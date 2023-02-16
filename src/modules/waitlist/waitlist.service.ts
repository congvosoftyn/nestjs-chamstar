import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { OpenHourEntity } from 'src/entities/OpenHour.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import { StoreSettingEntity } from 'src/entities/StoreSetting.entity';
import { WaitListEntity } from 'src/entities/WaitList.entity';
import TextMessage from 'src/shared/utils/Message';
import { GetWaitListsDto } from './dto/GetWaitLists.dto';
import { NewWaitListDto } from './dto/NewWaitList.dto';
import { RequestWaitListFromCustomerDto } from './dto/RequestWaitListFromCustomer.dto';
import { WaitlistGateway } from './waitlist.gateway';

@Injectable()
export class WaitlistService {
    constructor(
        @Inject(forwardRef(() => WaitlistGateway))
        private waitlistGateway: WaitlistGateway,
    ) { }


    async getWaitLists(query: GetWaitListsDto, storeId: number) {
        let search: string;
        if (query.search) {
            search = query.search as string;
        } else if (query.filter) {
            search = query.filter as string;
        } else {
            search = '';
        }
        return await WaitListEntity
            .find({
                where: { storeId, isDone: false, isDeleted: false },
                relations: ['customer'],
                order: { created: 'ASC' }
            });
    }


    async newWaitList(body: NewWaitListDto, storeId: number, companyId: number) {
        let waitlist = body as WaitListEntity;
        const isNew = !waitlist.id;
        waitlist.storeId = storeId;

        // succesful validation
        let old_table_size = -1
        if (!isNew) {
            old_table_size = (await WaitListEntity.findOneBy({ id: waitlist.id })).size
        }
        waitlist = await WaitListEntity.save(waitlist);
        const storeSetting = await StoreSettingEntity.findOneBy({ storeId: waitlist.storeId })
        // if send message setting is set to false respone and not process to send message
        if (!storeSetting.sendMessageAddingToWaitlist) return waitlist;

        let message;
        waitlist.customer = await CustomerEntity.findOneBy({ id: waitlist.customerId })
        if (isNew) {
            message = storeSetting.customMessageForNewWaitlist || `Hi ${waitlist.customer.firstName} \nThanks for joining our waiting list. Enjoy your wait and we'll send you another text as soon as your table becomes available.`
        }
        // waitlist already exists, notify customer new update
        else {
            // only notify customer that table size has been updated, other properties are store internal update
            message = `Hi ${waitlist.customer.firstName} \nYour reservation table size has been updated to ${waitlist.size}.`
            // emit updated table size in socket for uzmos client to update
            this.waitlistGateway.sendNotiWaitList(`${waitlist.id}:update`, { size: waitlist.size });
        }
        // only notify customer if table size has been updated or new waitlist created (if new waitlist, old table size will retain -1)
        if (old_table_size != waitlist.size) {
            await this.notifyCustomer(waitlist.customerId, message, companyId)
        }

        return waitlist;
    }

    async setDone(id: number) {
        let result = await WaitListEntity.findOneBy({ id });
        if (result) {
            result.isDone = true;
            result.doneDate = new Date();
            await WaitListEntity.save(result);
            // after set done, broadcast events to uzmos clients which currently are in the store waitlist to update their position in the frontend
            // emit event to client that store has someone is setdone 
            this.waitlistGateway.sendNotiWaitList(`${result.storeId}:lineout`, { lineout: true });
            return result;
        }
        else throw new NotFoundException(`not found with id ${id}`);
    }

    async sendMessage(id: number, companyId: number, storeId: number) {
        const table = await WaitListEntity.findOne({ where: { id: id }, relations: ['customer'] });
        if (!table) {
            throw new NotFoundException(`not found with id ${id}`);
        }
        const customMessage = (await StoreSettingEntity.findOneBy({ storeId })).customMessageForWaitlistReady
        const message = customMessage || `Hi ${table.customer.firstName} \n We have a table for you now - please make your way back and make yourself comfortable.`
        await this.notifyCustomer(table.customerId, message, companyId);
        table.messageSent = true;
        table.messageSentDate = new Date();
        await WaitListEntity.save(table);
        return table;
    }

    async callNumber(id: number) {
        let table = await WaitListEntity.findOne({ where: { id: id }, relations: ['customer'] });

        if (!table) throw new NotFoundException(`not found with id ${id}`)

        const message = new TextMessage();
        const text = `Hi ${table.customer.firstName}, we have a table for you now - please make your way back and make yourself comfortable.`;
        const result = await message.callPhone(table.customer.phoneNumber, text);
        if (result.status != 'failed') {
            table.phoneCalled = true;
            table.phoneCalledDate = new Date();
            await WaitListEntity.save(table);
        }
        return table;
    }

    /// Author: Dat Vo 
    async getCustomerActiveWaitlist(customerId: number) {
        const customer_active_waitlist = await this.queryCustomerWaitlistById(customerId, false)

        for await (let table of customer_active_waitlist) {
            const position = await this.calculateCustonmerTablePosition(table.store_id, table.id)
            // attached position return from calculateCustomerTablePosition to table object that will be sent back to uzmos mobile client
            table.position = position
        }

        return customer_active_waitlist;
    }


    /// Author: Dat Vo 
    // Function that return customer waitlist history in uzmos app
    async getCustomerHistoryWaitlist(customerId: number) {
        // pass true to queryCustomerWaitlistById to get history
        return await this.queryCustomerWaitlistById(customerId, true)
    }

    /// Author: Dat vo
    /// Function that handle customer waitlist request in uzmos app
    async requestWaitListFromCustomer(body: RequestWaitListFromCustomerDto, customerId: number) {
        const { distanceToStore, storeId, tableSize } = body;

        if (!storeId || !tableSize || tableSize < 1) throw new BadRequestException('Invalid request - Validation Failed!');
        // query customer data then use socket to notify store owner custoemr request
        const customer = await CustomerEntity.findOne({
            where: { id: customerId },
            select: ["id", "firstName", "lastName", "phoneNumber"]
        })
        // const {io} = response.locals
        // forecast new waitlist request to store client

        const event = "new-waitlist";
        this.waitlistGateway.sendNotiWaitListIn(storeId, event, { customer, tableSize, distanceToStore })
        //  io.emit(event,{customer,tableSize,distanceToStore})
        return { requested: true };
    }
    // Author: Dat vo
    // Function that handles logic store owner cancel waitlist request from customer uzmos app
    async cancelWaitlistRequestOfCustomer(customerId: number, storeId: number, companyId: number) {
        if (!storeId || !customerId || !companyId) throw new BadRequestException('Invalid request - Validation Failed!')

        const customer = await CustomerEntity.findOneBy({ id: customerId })
        // notify uzmos client that waitlist request has been canceled
        const message = `Hi ${customer.firstName}, We are sorry to inform that we have no available table at the time, please try again in a few minutes.`
        await this.notifyCustomer(customer.id, message, companyId)
        return { cancel: true };
    }

    /// Author: Huy Le
    // That function return the statistic (how many times they visted this store) of customer on Waitlist Create Form
    // Input: customer's phoneNumber , StoreId
    // Output: {customerId, phone, vistedTimes,lastDate}
    async getACustomerStatistic(phoneNumber: string, storeId: number) {
        const selective_data = ["storeId", "customerId", "doneDate"];

        const customer = await CustomerEntity
            .createQueryBuilder("c")
            .where("c.phoneNumber = :phone", { phone: phoneNumber })
            .select(["id", "phoneNumber"]).getRawOne();

        if (customer != null) {
            const customerHistory = await WaitListEntity
                .createQueryBuilder("w")
                .where("w.storeId = :id", { id: storeId })
                .andWhere("w.customerId = :customerId", { customerId: customer.id })
                .andWhere("w.isDeleted = false")
                .andWhere("w.isDone = true")
                .select(selective_data).orderBy("doneDate", "DESC")
                .getRawMany();

            if (customerHistory.length > 0) {

                var result = {
                    "customerId": customer.id,
                    "phone": customer.phoneNumber,
                    "vistedTimes": customerHistory.length,
                    "lastDate": customerHistory[0].doneDate
                }
                return result;
            } else {
                return {};
            }
        } else {
            return {};
        }
    }

    ///Author: Huy Le
    //Input: {storeId}
    //Output: {CustomerOnWaitlist,Seated,AverageTimeForGroup[{1-4},{5-6},{7}]}
    async getWailistStatisticForAStore(storeId: number) {
        if (!storeId) throw new NotFoundException('StoreId not found!');

        var lastMidNight = new Date(new Date().setHours(0, 0, 0, 0));
        var nextMidNight = new Date(new Date().setHours(24, 0, 0, 0));
        var currentTime = new Date();
        const selective_data = ["id", "customerId", "storeId", "size", "isDone", "created"];

        var data = await WaitListEntity
            .createQueryBuilder("w")
            .andWhere("isDeleted = false")
            .andWhere("w.storeId =:sid", { sid: storeId })
            .select(selective_data)
            .getRawMany();

        var waiting = data.filter(w => w.isDone == 0 && w.created > lastMidNight && w.created < nextMidNight);
        var seated = data.filter(w => w.isDone == 1 && w.created > lastMidNight && w.created < nextMidNight);
        var party1to4 = data.filter(w => w.size <= 4 && w.isDone == true);
        var party5to6 = data.filter(w => w.size <= 6 && w.size >= 5 && w.isDone == true);
        var party7up = data.filter(w => w.size >= 7 && w.isDone == true);

        var averageTimeForPartyOf4 = 0;
        var averageTimeForPartyOf5 = 0;
        var averageTimeForPartyOf7 = 0;

        if (party1to4.length > 0) {
            Array.prototype.forEach.call(party1to4, w => {

                var createdTime = new Date(w.created);
                // waitingTime in minute
                var waitingTime = Math.floor((new Date().getTime() - createdTime.getTime()) / (1000 * 60));
                averageTimeForPartyOf4 += waitingTime;
            })

            averageTimeForPartyOf4 /= party1to4.length;
        }

        if (party5to6.length > 0) {
            Array.prototype.forEach.call(party5to6, w => {

                var createdTime = new Date(w.created);
                // waitingTime in minute
                var waitingTime = Math.floor((new Date().getTime() - createdTime.getTime()) / (1000 * 60));
                averageTimeForPartyOf5 += waitingTime;
            })

            averageTimeForPartyOf5 /= party5to6.length;
        }

        if (party7up.length > 0) {
            Array.prototype.forEach.call(party7up, w => {

                var createdTime = new Date(w.created);
                // waitingTime in minute
                var waitingTime = Math.floor((new Date().getTime() - createdTime.getTime()) / (1000 * 60));
                averageTimeForPartyOf7 += waitingTime;
            })
            averageTimeForPartyOf7 /= party7up.length;
        }

        return {
            "waiting": waiting.length,
            "seated": seated.length,
            "party1to4": { "averageTime": averageTimeForPartyOf4.toFixed(0), "length": party1to4.length },
            "party5to6": { "averageTime": averageTimeForPartyOf5.toFixed(0), "length": party5to6.length },
            "party7up": { "averageTime": averageTimeForPartyOf7.toFixed(0), "length": party7up.length },
        };
    }

    /// Author Huy Le
    // Automatic Remove Waitlist after default time || after store closed 
    //(if does not have store's closing Hour, default time shoule be mid night)
    async autoRemoveWaitlist(storeId: number) {
        const selective_data = ["id", "customerId", "storeId", "size", "isDone", "created"];
        const toDay = new Date();

        let data = await WaitListEntity
            .createQueryBuilder("w")
            .where("w.storeId =:sid", { sid: storeId })
            .andWhere("w.isDeleted = false")
            .andWhere("w.isDone = false")
            .andWhere("w.created <:today", { today: toDay })
            .select(selective_data)
            .getRawMany();

        data.map(w => {
            w.isDeleted = true;
            w.deletedDate = new Date();
        });

        await WaitListEntity.save(data);
        return 'Auto Remove WaitList completed!';
    }



    /// Author: Huy Le - follow setDone function
    async deleteWaitlist(waitlistId: number) {
        if (waitlistId) {
            let result = await WaitListEntity.findOneBy({ id: waitlistId });
            if (result) {
                result.isDeleted = true;
                result.deletedDate = new Date();
                await WaitListEntity.save(result);
                return result
            }
            else {
                throw new NotFoundException(`not found with id ${waitlistId}`)
            }

        } else {
            throw new NotFoundException(`not found with id ${waitlistId}`)
        }
    }

    /// Author Huy Le
    /// Insert Open Hour must be deleted after finish function Automatic remove waitlist
    async insertOpenHour() {
        var a = new OpenHourEntity();

        // a.fromHour = new Date(new Date().setHours(10,0,0,0));  // wrong style
        // a.toHour = new Date(new Date().setHours(21,0,0,0)); // wrong style
        a.storeId = 3;
        a.day = 1;
        // a.day = 'Open Hours'; // logic? 

        return await OpenHourEntity.save(a);
    }

    /// ================== HELPER METHODS =============================
    /// Author: Dat Vo 
    // Helper function that calculate the current position of a table in a store waitlist
    private async calculateCustonmerTablePosition(storeId: number, tableId: number): Promise<number> {
        try {
            // get all store active waitlist order by time checkin - the earlier time checkin the less index table is
            const store_active_waitlist = await WaitListEntity.find({ where: { storeId, isDone: false }, order: { created: 'ASC' } })

            // find current position of table in the store waitlist
            const customer_table_position = store_active_waitlist.findIndex(table => table.id == tableId)
            return customer_table_position + 1

        } catch (err) {
            throw err
        }

    }
    /// Author: Dat vo
    // Helper function that query customer waitlist either active waitlist or history based on argument pass
    private async queryCustomerWaitlistById(customerId: number, getHistory: boolean): Promise<any[]> {
        // only query some store properties and waitlist properties that uzmos mobile client needs, to avoid querying store secretKey and unnecessary properties.
        const selective_data = ["waitlist.id as id", "quoted", "size", "notes", "created", "store.id", "store.name", "store.phoneNumber", "store.email", "store.image"]
        let isDone = false
        let order = {}
        if (getHistory) {
            selective_data.push('doneDate')
            isDone = true
            order['doneDate'] = 'DESC'

        }
        else {
            order['created'] = 'ASC'
        }
        try {
            const customer_waitlist = await WaitListEntity
                .createQueryBuilder("waitlist")
                .innerJoin(StoreEntity, 'store', 'store.id = waitlist.storeId')
                .where({ customerId, isDone })
                .orderBy(order)
                .select(selective_data)
                .getRawMany()
            return customer_waitlist
        } catch (err) {
            throw err
        }

    }

    /// Author: Dat Vo
    // Helper function that implements logic for notify customer
    private async notifyCustomer(customerId: number, message: string, companyId: number) {
        if (!customerId) throw new Error('No customer found')
        try {
            const text = new TextMessage()
            const notify_response = await text.sendToCustomerId(customerId, message, companyId, '/home/waitlist')
            return notify_response
        } catch (err) {
            throw err
        }
    }
}
