import {
  plainToInstance,
  instanceToPlain,
  ClassConstructor,
} from 'class-transformer';

export function transformWithGroups<T>(
  dtoClass: ClassConstructor<T>,
  data: object | object[],
  groups: string[],
): any {
  const instance = plainToInstance(dtoClass, data, { groups });
  return instanceToPlain(instance, { groups });
}
