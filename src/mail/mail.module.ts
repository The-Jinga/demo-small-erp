import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MailProcessor } from './mail.processer';
import { MailService } from './mail.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
  ],
  providers: [MailProcessor, MailService],
  exports: [MailService],
})
export class MailModule {}
