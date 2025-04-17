import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail-queue') private mailQueue: Queue) {}

  async sendApprovalPurchaseOrder(emails: string[]) {
    await this.mailQueue.add('send-approval-purchase-order-mail', {
      emails,
    });
  }
}
