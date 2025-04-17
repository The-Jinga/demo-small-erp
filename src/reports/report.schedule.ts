import { Queue } from 'bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class ReportSchedule implements OnModuleInit {
  constructor(@InjectQueue('report-queue') private readonly queue: Queue) {}
  async onModuleInit() {
    await this.queue.upsertJobScheduler(
      'update-supplier-spending-report-cache',
      {
        pattern: '59 23 * * *',
      },
    );
  }
}
