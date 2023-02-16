import { Logger, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { WsGuard } from 'src/shared/guards/wsGuard.pipe';
import { CustomersService } from '../customers/customers.service';
import { MessageService } from '../message/message.service';
import { ChatService } from './chat.service';
let timeStamp = Date.parse(new Date().toString());

function emitAsync(socket: Socket, emitName: string, data: any, callback: Function) {
  return new Promise((resolve, reject) => {
    if (!socket || !socket.emit) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('pls input socket');
    }
    socket.emit(emitName, data, (...args: any) => {
      let response: unknown;
      if (typeof callback === 'function') {
        response = callback(...args);
      }
      resolve(response);
    });
  });
}

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayDisconnect, OnGatewayConnection {
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private chatService: ChatService,
    private customersService: CustomersService,
    private messageService: MessageService
  ) { }

  private socketId;
  private user_id;
  private clientHomePageList;

  @WebSocketServer()
  wss: Server;

  private limitCount = {};

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.verbose(`Client activity Connected: ${client.id}`);
    this.socketId = client.id;
    console.log('connection socketId=>', this.socketId, 'time=>', new Date().toLocaleString());

    await emitAsync(client, 'initSocket', this.socketId, (userId, homePageList) => {
      console.log('userId', userId);
      this.user_id = userId;
      this.clientHomePageList = homePageList;
    })

    const allMessage = await this.messageService.getAllMessage({ user_id: this.user_id, clientHomePageList: this.clientHomePageList });
    client.emit('initSocketSuccess', allMessage);
    console.log('initSocketSuccess user_id=>', this.user_id, 'time=>', new Date().toLocaleString());

    client.use((packet, next) => {
      if (!this.requestFrequency(this.socketId)) return next();
      next(new Error('Access interface frequently, please try again in a minute!'));
    })

    // init socket
    const arr = await this.customersService.getCustomerInfo(this.user_id);
    const existSocketIdStr = this.getSocketIdHandle(arr);
    const newSocketIdStr = existSocketIdStr ? `${existSocketIdStr},${this.socketId}` : this.socketId;
    await this.customersService.saveCustomerSocketId(this.user_id, newSocketIdStr);
    console.log('initSocket user_id=>', this.user_id, 'time=>', new Date().toLocaleString());

    // // init GroupChat
    // const result = await userService.getGroupList(user_id);
    // const groupList = JSON.parse(JSON.stringify(result));
    // for (const item of groupList) {
    //     socket.join(item.to_group_id);
    // }
    // console.log('initGroupChat user_id=>', user_id, 'time=>', new Date().toLocaleString());

  }

  async handleDisconnect(client: Socket, ...args: any[]) {
    this.logger.verbose(`Client activity Disconnected: ${client.id}`);
    this.logger.verbose(`Client Disconnected: ${client.id}`);

    try {
      const arr = await this.customersService.getCustomerInfo(this.user_id);
      const existSocketIdStr = this.getSocketIdHandle(arr);
      const toUserSocketIds = (existSocketIdStr && existSocketIdStr.split(',')) || [];
      const index = toUserSocketIds.indexOf(this.socketId);

      if (index > -1) {
        toUserSocketIds.splice(index, 1);
      }

      await this.customersService.saveCustomerSocketId(this.user_id, toUserSocketIds.join(','));

      // if (toUserSocketIds.length) {
      //   await userService.saveUserSocketId(_userId, toUserSocketIds.join(','));
      // } else {
      //   await Promise.all([
      //     userService.saveUserSocketId(_userId, toUserSocketIds.join(',')),
      //     userService.updateUserStatus(_userId, 0)
      //   ]);
      // }

      // console.log('disconnect.=>reason', this.reason, 'user_id=>', this.user_id, 'socket.id=>', client.id, 'time=>', new Date().toLocaleString(),);
    } catch (error) {
      console.log('error', error.message);
      this.wss.to(`${client.id}`).emit('error', { code: 500, message: error.message });
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  getSocketIdHandle(arr: CustomerEntity) {
    return arr.socketId ?? '';
  }

  requestFrequency(socketId) {
    const nowTimeStamp = Date.parse(new Date().toString());
    if (nowTimeStamp - timeStamp > 60000) {
      // more than 60 seconds
      this.limitCount = {};
      timeStamp = nowTimeStamp;
      return false;
    } // less than 60 seconds
    if (this.limitCount[socketId] > 30) {
      return true;
    }
    this.limitCount[socketId] = (this.limitCount[socketId] || 0) + 1;
    return false;
  };



  // private chat
  @UseGuards(WsGuard)
  @SubscribeMessage('sendPrivateMsg')
  async sendPrivateMsg(client: Socket, payload: { data: any, cbFn: any }) {
    try {
      if (!payload.data) return;
      payload.data.time = Date.parse(new Date().toString()) / 1000;
      await Promise.all([
        this.chatService.savePrivateMsg({
          ...payload.data,
          attachments: JSON.stringify(payload.data.attachments)
        }),
        this.customersService.getCustomerSocketId(payload.data.to_user).then((arr) => {
          const existSocketIdStr = this.getSocketIdHandle(arr);
          const toUserSocketIds = (existSocketIdStr && existSocketIdStr.split(',')) || [];

          toUserSocketIds.forEach(e => {
            this.wss.to(`${e}`).emit('getPrivateMsg', payload.data);
          })
        })
      ])
      console.log('sendPrivateMsg data=>', payload.data, 'time=>', new Date().toLocaleString());
      payload.cbFn(payload.data);
    } catch (error) {
      console.log('error', error.message);
      this.wss.to(client.id).emit('error', { code: 500, message: error.message })
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('getOnePrivateChatMessages')
  async getOnePrivateChatMessages(client: Socket, payload: { data: any, fn: any }) {
    try {
      const { user_id, toUser, start, count } = payload.data;
      const RowDataPacket = await this.chatService.getPrivateDetail(user_id, toUser, start - 1, count);
      const privateMessages = JSON.parse(JSON.stringify(RowDataPacket));
      console.log(
        'getOnePrivateChatMessages data=>',
        payload.data,
        'time=>',
        new Date().toLocaleString(),
      );
      payload.fn(privateMessages);
    } catch (error) {
      console.log('error', error.message);
      this.wss.to(client.id).emit('error', { code: 500, message: error.message })
    }
  }


  // get group messages in a group;
  //   socket.on('getOneGroupMessages', async (data, fn) => {
  //     try {
  //       const RowDataPacket = await groupChatService.getGroupMsg(
  //         data.groupId,
  //         data.start - 1,
  //         data.count,
  //       );
  //       const groupMessages = JSON.parse(JSON.stringify(RowDataPacket));
  //       console.log('getOneGroupMessages data=>', data, 'time=>', new Date().toLocaleString());
  //       fn(groupMessages);
  //     } catch (error) {
  //       console.log('error', error.message);
  //       io.to(socketId).emit('error', { code: 500, message: error.message });
  //     }
  //   });

  // get group item including messages and group info.
  //   socket.on('getOneGroupItem', async (data, fn) => {
  //     try {
  //       const groupMsgAndInfo = await getGroupItem({
  //         groupId: data.groupId,
  //         start: data.start || 1,
  //         count: 20,
  //       });
  //       console.log('getOneGroupItem data=>', data, 'time=>', new Date().toLocaleString());
  //       fn(groupMsgAndInfo);
  //     } catch (error) {
  //       console.log('error', error.message);
  //       io.to(socketId).emit('error', { code: 500, message: error.message });
  //     }
  //   });


  //   socket.on('createGroup', async (data, fn) => {
  //     try {
  //       const to_group_id = uuid();
  //       data.create_time = Date.parse(new Date().toString()) / 1000;
  //       const { name, group_notice, creator_id, create_time } = data;
  //       const arr = [to_group_id, name, group_notice, creator_id, create_time];
  //       await groupService.createGroup(arr);
  //       await groupService.joinGroup(creator_id, to_group_id);
  //       socket.join(to_group_id);
  //       console.log('createGroup data=>', data, 'time=>', new Date().toLocaleString());
  //       fn({ to_group_id, ...data });
  //     } catch (error) {
  //       console.log('error', error.message);
  //       io.to(socketId).emit('error', { code: 500, message: error.message });
  //     }
  //   });


  //   socket.on('updateGroupInfo', async (data, fn) => {
  //     try {
  //       await groupService.updateGroupInfo(data);
  //       console.log('updateGroupInfo data=>', data, 'time=>', new Date().toLocaleString());
  //       fn('修改群资料成功');
  //     } catch (error) {
  //       console.log('error', error.message);
  //       io.to(socketId).emit('error', { code: 500, message: error.message });
  //     }
  //   });


  //   socket.on('joinGroup', async (data, fn) => {
  //     try {
  //       const { userInfo, toGroupId } = data;
  //       const joinedThisGroup = (await groupService.isInGroup(userInfo.user_id, toGroupId)).length;
  //       if (!joinedThisGroup) {
  //         await groupService.joinGroup(userInfo.user_id, toGroupId);
  //         socket.broadcast.to(toGroupId).emit('getGroupMsg', {
  //           ...userInfo,
  //           message: `${userInfo.name}加入了群聊`,
  //           to_group_id: toGroupId,
  //           tip: 'joinGroup',
  //         });
  //       }
  //       socket.join(toGroupId);
  //       const groupItem = await getGroupItem({ groupId: toGroupId });
  //       console.log('joinGroup data=>', data, 'time=>', new Date().toLocaleString());
  //       fn(groupItem);
  //     } catch (error) {
  //       console.log('error', error.message);
  //       io.to(socketId).emit('error', { code: 500, message: error.message });
  //     }
  //   });


  //   socket.on('leaveGroup', async data => {
  //     try {
  //       const { user_id, toGroupId } = data;
  //       socket.leave(toGroupId);
  //       await groupService.leaveGroup(user_id, toGroupId);
  //       console.log('leaveGroup data=>', data, 'time=>', new Date().toLocaleString());
  //     } catch (error) {
  //       console.log('error', error.message);
  //       io.to(socketId).emit('error', { code: 500, message: error.message });
  //     }
  //   });

  //   socket.on('getGroupMember', async (groupId, fn) => {
  //     try {
  //       const RowDataPacket = await groupChatService.getGroupMember(groupId);
  //       const userInfos = JSON.parse(JSON.stringify(RowDataPacket));
  //       io.in(groupId).clients((err, onlineSockets) => {
  //         if (err) {
  //           throw err;
  //         }
  //         userInfos.forEach(userInfo => {
  //           userInfo.status = 0;
  //           if (userInfo.socketid) {
  //             const socketIds = userInfo.socketid.split(',');
  //             for (const onlineSocket of onlineSockets) {
  //               const socketExist = socketIds.some(socketId => socketId === onlineSocket);
  //               if (socketExist) {
  //                 userInfo.status = 1;
  //               }
  //             }
  //           }
  //           delete userInfo.socketid;
  //         });
  //         console.log('getGroupMember data=>', groupId, 'time=>', new Date().toLocaleString());
  //         fn(userInfos);
  //       });
  //     } catch (error) {
  //       console.log('error', error.message);
  //       io.to(socketId).emit('error', { code: 500, message: error.message });
  //     }
  //   });

  @UseGuards(WsGuard)
  @SubscribeMessage('fuzzyMatch')
  async fuzzyMatch(client: Socket, payload: { data: any, fn: any }) {
    try {
      let fuzzyMatchResult;
      if (payload.data.searchUser) {
        fuzzyMatchResult = await this.customersService.fuzzyMatchUsers(payload.data.field);
      }
      //   else {
      //     fuzzyMatchResult = await groupService.fuzzyMatchGroups(field);
      //   }
      payload.fn({ fuzzyMatchResult, searchUser: payload.data.searchUser });
    } catch (error) {
      console.log('error', error.message);
      this.wss.to(client.id).emit('error', { code: 500, message: error.message })
    }
  }

  // token
  //   socket.on('getToken', async (data, fn) => {
  //     try {
  //       const uploadToken = await getUploadToken();
  //       console.log('getToken data=>', data, 'time=>', new Date().toLocaleString());
  //       return fn(uploadToken);
  //     } catch (error) {
  //       console.log('error', error.message);
  //       io.to(socketId).emit('error', { code: 500, message: error.message });
  //     }
  //   });

  @UseGuards(WsGuard)
  @SubscribeMessage('addAsTheContact')
  async addAsTheContact(client: Socket, payload: { data: any, fn: any }) {
    try {
      const { user_id, from_user } = payload.data;
      const time = Date.now() / 1000;
      await this.customersService.followCustomer(user_id, from_user);
      const customerInfo = await this.customersService.getCustomerInfo(from_user);
      console.log('addAsTheContact data=>', payload.data, 'time=>', new Date().toLocaleString());
      payload.fn(customerInfo);
    } catch (error) {
      console.log('error', error.message);
      this.wss.to(client.id).emit('error', { code: 500, message: error.message })
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('getUserInfo')
  async getUserInfo(client: Socket, payload: { user_id: number, fn: any }) {
    const { user_id, fn } = payload;
    try {
      const userInfo = await this.customersService.getCustomerInfo(user_id);
      console.log('getUserInfo user_id=>', user_id, 'time=>', new Date().toLocaleString());
      fn(userInfo[0]);
    } catch (error) {
      console.log('error', error.message);
      this.wss.to(client.id).emit('error', { code: 500, message: error.message })
    }
  }

  // socket.on('robotChat', async (data, fn) => {
  //     try {
  //         const date = {
  //             key: configs.robot_key,
  //             info: data.message,
  //             userid: data.user_id,
  //         };
  //         const options = {
  //             method: 'POST',
  //             uri: 'http://www.tuling123.com/openapi/api',
  //             body: date,
  //             json: true, // Automatically stringifies the body to JSON
  //         };
  //         const response = configs.robot_key
  //             ? await request(options)
  //             : {
  //                 text:
  //                     '请在 http://www.tuling123.com/ 登录并注册个机器人, 取到apikey放到代码configs中',
  //             };
  //         console.log('robotChat data=>', data, 'time=>', new Date().toLocaleString());
  //         fn(response);
  //     } catch (error) {
  //         console.log('error', error.message);
  //         io.to(socketId).emit('error', { code: 500, message: error.message });
  //     }
  // });

  @UseGuards(WsGuard)
  @SubscribeMessage('deleteContact')
  async deleteContact(client: Socket, payload: { data: { from_user: number, to_user: number }, fn: any }) {
    const { data, fn } = payload;
    const { from_user, to_user } = data;

    try {
      await this.customersService.unfollowCustomer(from_user, to_user);
      const sockets = await this.customersService.getCustomerSocketId(to_user);
      const existSocketIdStr = this.getSocketIdHandle(sockets);
      const toUserSocketIds = (existSocketIdStr && existSocketIdStr.split(',')) || [];
      toUserSocketIds.forEach(e => {
        this.wss.to(e).emit('beDeleted', from_user);
      });
      console.log(
        'deleteContact user_id && to_user =>',
        from_user,
        to_user,
        'time=>',
        new Date().toLocaleString(),
      );
      fn({ code: 200, data: 'delete contact successfully' });
    } catch (error) {
      console.log('error', error.message);
      this.wss.to(client.id).emit('error', { code: 500, message: error.message })
    }
  }

}

