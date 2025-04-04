import { Resolver, FieldValues } from "react-hook-form";
import { validate } from "class-validator";

export const ClassValidatorResolver =
  <
    T extends DTO,
    DTO extends {
      [key in keyof T]: unknown;
    },
  >(
    dto: DTO
  ) =>
  async (data: T) => {
    (Object.keys(dto) as unknown as (keyof DTO)[]).forEach((key) => {
      dto[key] = data[key as keyof DTO];
    });

    const errors = await validate(dto);

    if (errors.length === 0) {
      return {
        values: data,
        errors: {},
      };
    }

    const value = {
      values: data,
      errors: Object.fromEntries(
        errors.map((error) => {
          if (!error.constraints) {
            return [
              error.property,
              {
                type: "validation",
                message: "Validation error",
              },
            ];
          }

          const errorsKeys = Object.keys(error.constraints);

          return [
            error.property,
            {
              type: "validation",
              message: error?.constraints?.[errorsKeys[errorsKeys.length - 1]],
            },
          ];
        })
      ),
    };

    return value;
  };

export type ClassValidatorResolverDef = <
  T extends FieldValues,
  DTO extends object,
>(
  dto: DTO
) => Resolver<T>;
