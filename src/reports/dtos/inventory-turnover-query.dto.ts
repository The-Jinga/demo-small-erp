import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class InventoryTurnoverQueryDto {
  @ApiProperty({
    description: 'Start date in ISO format (YYYY-MM-DD)',
    example: '2025-04-01',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be a valid ISO date string',
  })
  start: string;

  @ApiProperty({
    description: 'End date in ISO format (YYYY-MM-DD)',
    example: '2025-04-28',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endDate must be a valid ISO date string',
  })
  end: string;
}
