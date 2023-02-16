import { forwardRef, Module } from '@nestjs/common';
import { ChatModule } from '../chat/chat.module';
import { CustomersModule } from '../customers/customers.module';
import { MessageService } from './message.service';

@Module({
  imports: [forwardRef(() => ChatModule), CustomersModule],
  providers: [MessageService],
  exports: [MessageService]
})
export class MessageModule { }
