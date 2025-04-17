import { IsString, IsEmail, IsEnum, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums';

export class RegisterDto {
  @ApiProperty({
    description: 'Valid email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description:
      'Secure password (min 8 chars, includes uppercase, lowercase, number, and special character)',
    example: 'StrongP@ssw0rd!',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
  @Matches(/[@$!%*?&]/, {
    message:
      'Password must contain at least one special character (@, $, !, %, *, ?, &)',
  })
  password: string;

  @ApiProperty({
    enum: UserRole,
    description: 'Role assigned to the user',
    example: UserRole.PROCUREMENT,
  })
  @IsEnum(UserRole)
  role: UserRole;
}
