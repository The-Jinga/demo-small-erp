import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from 'src/users/user.service';

@ValidatorConstraint({ name: 'IsEmailExists', async: true })
@Injectable()
export class IsEmailExists implements ValidatorConstraintInterface {
  constructor(protected readonly userService: UsersService) {}

  async validate(email: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);
    return !user;
  }

  defaultMessage(): string {
    return 'Email exists';
  }
}
