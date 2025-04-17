import { Matches } from 'class-validator';

export class InventoryTurnoverQueryDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be a valid ISO date string',
  })
  start: string;
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endDate must be a valid ISO date string',
  })
  end: string;
}
