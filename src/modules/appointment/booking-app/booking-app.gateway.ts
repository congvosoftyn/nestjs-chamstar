import { Logger, UseGuards } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { LIFE_SECRET } from 'src/config';
import { WsGuard } from 'src/shared/guards/wsGuard.pipe';

@WebSocketGateway({ namespace: 'booking-app' })
export class BookingAppGateway implements OnGatewayDisconnect, OnGatewayConnection {
  private readonly logger = new Logger(BookingAppGateway.name);

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
  @SubscribeMessage('bookingApp.join')
  userJoin(@ConnectedSocket() client: Socket) {
    try {
      const token = client.handshake.headers.authorization?.split(' ')?.[1];
      const decoded = jwt.verify(token, `${LIFE_SECRET}`) as any;
      this.users[client.id] = decoded.storeId
    } catch (err) {
      console.log(err);
    }
  }

  sendNotiBookingApp(id: number, parameter: string, data: any) {
    this.wss.sockets.in(id.toString()).emit(`${parameter}`, data);
  }
}
