import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivateChatEntity } from 'src/entities/PrivateChat.entity';
import { CustomersModule } from '../customers/customers.module';
import { MessageModule } from '../message/message.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [
    CustomersModule,
    MessageModule,
    TypeOrmModule.forFeature([PrivateChatEntity])
  ],
  providers: [ChatService, ChatGateway],
  exports: [ChatService]
})
export class ChatModule { }
