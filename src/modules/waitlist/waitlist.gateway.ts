import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'waitlist' })
export class WaitlistGateway implements OnGatewayDisconnect, OnGatewayConnection {
  private readonly logger = new Logger(WaitlistGateway.name);

  @WebSocketServer()
  wss: Server;

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.verbose(`Client activity Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): any {
    this.logger.verbose(`Client activity Disconnected: ${client.id}`);
    this.logger.verbose(`Client Disconnected: ${client.id}`);
  }

  sendNotiWaitList(parameter: string, data: any) {
    this.wss.emit(parameter, data);
  }

  sendNotiWaitListIn(id: number, parameter: string, data: any) {
    this.wss.sockets.in(`${id}`).emit(`${parameter}`, data);
  }
}
