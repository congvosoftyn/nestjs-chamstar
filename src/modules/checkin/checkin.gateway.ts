import { Logger, UseGuards } from '@nestjs/common';
import {  ConnectedSocket, OnGatewayConnection,  OnGatewayDisconnect,  SubscribeMessage,  WebSocketGateway,  WebSocketServer,} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { LIFE_SECRET } from 'src/config';
import { WsGuard } from 'src/shared/guards/wsGuard.pipe';

@WebSocketGateway({ namespace: 'checkin' })
export class CheckinGateway implements OnGatewayDisconnect, OnGatewayConnection {
  private readonly logger = new Logger(CheckinGateway.name);

  @WebSocketServer()
  wss: Server;

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.verbose(`Client activity Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): any {
    this.logger.verbose(`Client activity Disconnected: ${client.id}`);
    this.logger.verbose(`Client Disconnected: ${client.id}`);
  }

  private users = {}

  @UseGuards(WsGuard)
  @SubscribeMessage('checkin.join')
  userJoin(@ConnectedSocket() client: Socket) {
    try {
      const token = client.handshake.headers.authorization?.split(' ')?.[1];
      const decoded = jwt.verify(token, `${LIFE_SECRET}`) as any;
      this.users[client.id] = decoded.storeId
    } catch (err) {
      console.log(err);
    }
  }

  sendNotifyCheckIn(storeId: number, parameter: string, data: any) {
    const clientId = Object.keys(this.users).find(k => this.users[k] === storeId);
    this.wss.sockets.in(`${clientId}`).emit(`${parameter}`, data);
  }
}
