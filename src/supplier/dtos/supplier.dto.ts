import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../../common/enums/permission.enum';

export class SupplierDto {
  @Expose()
  @ApiProperty({ description: 'Supplier ID' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Supplier name' })
  name: string;

  @Expose()
  @ApiProperty({ description: 'Supplier email' })
  email: string;

  @Expose({ groups: [Permission.VIEW_FINANCIAL_FIELDS] })
  @ApiProperty({
    description: 'Credit limit of the supplier',
    required: false,
    example: '10000',
  })
  creditLimit: string;

  @Expose()
  @ApiProperty({
    description: 'Supplier creation date',
    type: String,
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
