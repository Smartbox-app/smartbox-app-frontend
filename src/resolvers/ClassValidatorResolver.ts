import { validate, ValidationError } from 'class-validator';
import { FieldErrors, FieldValues, Resolver } from 'react-hook-form';

const toFieldErrors = <T extends FieldValues>(
  errors: ValidationError[],
): FieldErrors<T> =>
  Object.fromEntries(
    errors.map((error) => {
      if (!error.constraints) {
        return [
          error.property,
          {
            type: 'validation',
            message: 'Validation error',
          },
        ];
      }

      const errorsKeys = Object.keys(error.constraints);

      return [
        error.property,
        {
          type: 'validation',
          message: error.constraints[errorsKeys[errorsKeys.length - 1]],
        },
      ];
    }),
  ) as FieldErrors<T>;

export const ClassValidatorResolver =
  <T extends FieldValues>(dto: T): Resolver<T> =>
  async (data) => {
    (Object.keys(dto) as (keyof T)[]).forEach((key) => {
      dto[key] = data[key];
    });

    const errors = await validate(dto);

    if (errors.length === 0) {
      return {
        values: data,
        errors: {},
      };
    }

    return {
      values: {},
      errors: toFieldErrors<T>(errors),
    };
  };

export type ClassValidatorResolverDef = <
  T extends FieldValues,
  DTO extends object,
>(
  dto: DTO,
) => Resolver<T>;
