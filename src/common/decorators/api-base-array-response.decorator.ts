import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { BaseResponseDto } from '../base-response.dto';

export const ApiBaseArrayResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(BaseResponseDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
