import { HttpStatus } from '@nestjs/common';

export class BaseController {
  ok<T>(message = 'Success', data?: T, statusCode = HttpStatus.OK) {
    const response: any = {
      statusCode,
      message,
    };

    if (data !== undefined && data !== null) {
      response.data = data;
    }

    return response;
  }
}
