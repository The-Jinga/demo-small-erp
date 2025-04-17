import { IsArray, IsUUID, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReceiveGoodsItemDto {
  @ApiProperty({
    description: 'UUID of the product being received',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description:
      'Quantity of the product received (must be a positive integer)',
    example: 10,
  })
  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}

export class ReceiveGoodsDto {
  @ApiProperty({
    type: [ReceiveGoodsItemDto],
    description: 'List of products and their received quantities',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceiveGoodsItemDto)
  items: ReceiveGoodsItemDto[];
}
