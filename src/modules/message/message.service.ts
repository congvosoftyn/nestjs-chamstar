import { Injectable } from '@nestjs/common';
import { ChatService } from '../chat/chat.service';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class MessageService {
    constructor(
        private chatService: ChatService,
        private customersService: CustomersService
    ) { }

    getPrivateMsg = async ({ toUser, user_id, start = 1, count = 20 }) => {
        const messages = await this.chatService.getPrivateDetail(user_id, toUser, start - 1, count);
        const userInfo = await this.customersService.getCustomerInfo(toUser);
        return {
            messages,
            userInfo: userInfo,
        };
    };

    // getGroupItem = async ({ groupId, start = 1, count = 20, }: { groupId: string; start?: number; count?: number; }) => {
    //     const RowDataPacket1 = await groupChatService.getGroupMsg(groupId, start - 1, count);
    //     const RowDataPacket2 = await groupChatService.getGroupInfo([groupId, null]);
    //     const RowDataPacket3 = await groupChatService.getGroupMember(groupId);
    //     const members = JSON.parse(JSON.stringify(RowDataPacket3));
    //     const messages = JSON.parse(JSON.stringify(RowDataPacket1));
    //     const groupInfo = JSON.parse(JSON.stringify(RowDataPacket2))[0];
    //     return {
    //         messages,
    //         groupInfo: { ...groupInfo, members },
    //     };
    // };

    getAllMessage = async ({ user_id, clientHomePageList }) => {
        try {
            const privateList = await this.customersService.getPrivateList(user_id);
            //    const groupList = await userService.getGroupList(user_id);
            //const homePageList = groupList.concat(privateList);
            const homePageList = privateList;
            const privateChat = new Map();
            // const groupChat = new Map();
            if (homePageList && homePageList.length) {
                for (const item of homePageList) {
                    if (clientHomePageList && clientHomePageList.length) {
                        const goal = clientHomePageList.find(e =>
                            e.user_id ? e.user_id === item.user_id : e.to_group_id === item.to_group_id,
                        );
                        if (goal) {
                            const sortTime = goal.time;
                            const res = await this.chatService.getUnreadCount({
                                sortTime,
                                fromCustomerId: user_id,
                                toCustomerId: item.user_id,
                            })
                            // const res = item.user_id
                            //   ? await ChatService.getUnreadCount({
                            //       sortTime,
                            //       fromCustomerId: user_id,
                            //       toCustomerId: item.user_id,
                            //     })
                            //   : await groupChatService.getUnreadCount({ sortTime, to_group_id: item.to_group_id });
                            item.unread = goal.unread + res.unread;
                        }
                    }
                    if (item.user_id) {
                        const data = await this.getPrivateMsg({ toUser: item.user_id, user_id });
                        privateChat.set(item.user_id, data);
                    }
                    // else if (item.to_group_id) {
                    //   const data = await getGroupItem({ groupId: item.to_group_id });
                    //   groupChat.set(item.to_group_id, data);
                    // }
                }
            }

            return {
                homePageList,
                privateChat: Array.from(privateChat),
                //   groupChat: Array.from(groupChat),
            };
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
