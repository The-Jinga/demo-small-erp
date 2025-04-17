import { Expose, Type } from 'class-transformer';
import { UserDto } from '../../users/dtos/user.dto';

export class ApprovalLogDto {
  @Expose() id: string;
  @Expose() action: string;
  @Expose() comment: string;
  @Expose() createdAt: Date;

  @Expose()
  @Type(() => UserDto)
  approvedBy: UserDto;
}
