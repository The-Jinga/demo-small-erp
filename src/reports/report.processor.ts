import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ReportsService } from './reports.service';

@Processor('report-queue')
export class ReportProcessor extends WorkerHost {
  constructor(private readonly reportsService: ReportsService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'update-supplier-spending-report-cache':
        await this.reportsService.updateSupplierSpendingCache();
        break;
      default:
        break;
    }
  }
}
