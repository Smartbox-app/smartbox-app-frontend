import { FormFieldBase, FormFieldType } from '../../formBuilder';
import { TranslatableError } from '../utils/translatableError';
import { requiredValidator } from '../validators';

export interface FormFieldDateTime extends FormFieldBase {
  type: FormFieldType.DateTime;
  value?: Date | string | Date[] | string[] | null;
  options?: {
    min?: Date;
    max?: Date;
    includeHours?: boolean;
    multiple?: boolean;
    descriptionBelow?: boolean;
  };
  settings?: {
    defaultEmptyVal?: any;
  };
}

export function defaultEmptyVal(field: Required<FormFieldDateTime>): any {
  const { options } = field;
  const multiple = options ? options.multiple : false;

  if (multiple === true) {
    return [];
  }

  return field && field.settings && field.settings.defaultEmptyVal
    ? field.settings.defaultEmptyVal
    : null;
}

export function formDataStrToRealValue(
  str: string,
  field: FormFieldDateTime
): any {
  if (field.options && field.options.multiple) {
    return str.split(',').map((s) => new Date(s));
  }

  return new Date(str);
}

function isValidDate(d: any): boolean {
  return d instanceof Date && !isNaN(d as any);
}

export async function defaultOptionsValidator(
  field: Required<FormFieldDateTime>
) {
  field.value =
    field.value === defaultEmptyVal(field)
      ? defaultEmptyVal(field)
      : field.options.multiple
      ? (field.value as string[]).map((d) => new Date(d))
      : new Date(field.value as string);
  const { value, options } = field;
  const { min, max, multiple } = options;

  if (multiple) {
    if (value === null || typeof (value as any[]).push !== 'function') {
      throw new TranslatableError(
        'Invalid type of value: {0} expected.',
        'array of Dates'
      );
    }

    for (const date of value as Date[]) {
      if (!isValidDate(date)) {
        throw new TranslatableError(
          'Invalid type of value: {0} expected.',
          'array of Dates'
        );
      }

      if (min && isValidDate(min) && +date < +min) {
        throw new TranslatableError('Date too low. Min. {0}.', min);
      }

      if (max && isValidDate(max) && +date > +max) {
        throw new TranslatableError('Date too high. Max. {0}.', max);
      }
    }
  } else {
    if (!isValidDate(value) && value !== null) {
      throw new TranslatableError(
        'Invalid type of value: {0} expected.',
        'Date or null'
      );
    }

    if (min && isValidDate(min) && value !== null) {
      if (+value < +min) {
        throw new TranslatableError('Date too low. Min. {0}.', min);
      }
    }

    if (max && isValidDate(max) && value !== null) {
      if (+value > +max) {
        throw new TranslatableError('Date too high. Max. {0}.', max);
      }
    }
  }
}

export function createDateTimeField(
  field: Pick<FormFieldDateTime, Exclude<keyof FormFieldDateTime, 'type'>>
): FormFieldDateTime {
  if (field.required === true) {
    field.validators = field.validators || [];
    field.validators.push(requiredValidator());
  }

  return {
    ...field,
    type: FormFieldType.DateTime,
  };
}

//@TODO: Add always default transformer
