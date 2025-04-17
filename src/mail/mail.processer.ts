import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('mail-queue')
export class MailProcessor extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'send-approval-purchase-order-mail':
        console.log('Sending email inventory team');
        break;
      default:
        break;
    }
  }
}
