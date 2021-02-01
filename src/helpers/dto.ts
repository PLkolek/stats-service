import { plainToClass } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';

export const toDto = <C, V>(dtoClass: ClassConstructor<C>, valuesObject: V) =>
  plainToClass(dtoClass, valuesObject, {
    excludeExtraneousValues: true,
  });
