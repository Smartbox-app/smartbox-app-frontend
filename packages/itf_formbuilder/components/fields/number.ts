import { FormFieldBase, FormFieldType } from '../../formBuilder';
import { requiredValidator } from '../validators/required';
import { TranslatableError } from '../utils/translatableError';
import { FormFieldCheckbox } from './checkbox';

export interface FormFieldNumber extends FormFieldBase {
  type: FormFieldType.Number;
  value?: number;
  options?: {
    type?: string;
    isFloat?: boolean;
    step?: number;
    min?: number;
    max?: number;
    descriptionBelow?: boolean;
  };
  settings?: {
    defaultEmptyVal?: any;
  };
}

export function defaultEmptyVal(field: Required<FormFieldNumber>): any {
  return field &&
    field.settings &&
    typeof field.settings.defaultEmptyVal !== 'undefined'
    ? field.settings.defaultEmptyVal
    : 0;
}

export function formDataStrToRealValue(
  str: string,
  field: FormFieldNumber
): any {
  return Number(str);
}

export async function defaultOptionsValidator(
  field: Required<FormFieldNumber>
) {
  const { value, options } = field;

  if (field.required && (typeof value !== 'number' || Number.isNaN(value))) {
    throw new TranslatableError(
      'Invalid type of value: {0} expected.',
      'number'
    );
  }

  if (options) {
    const { min, max } = options;

    if (typeof min === 'number') {
      if (value < min) {
        throw new TranslatableError('Value too low. Min. {0}.', min);
      }
    }

    if (typeof max === 'number') {
      if (value > max) {
        throw new TranslatableError('Value too high. Max. {0}.', max);
      }
    }
  }
}

export function createNumberField(
  field: Pick<FormFieldNumber, Exclude<keyof FormFieldNumber, 'type'>>
): FormFieldNumber {
  if (field.required === true) {
    field.validators = field.validators || [];
    field.validators.push(requiredValidator());
  }

  return {
    ...field,
    type: FormFieldType.Number,
  };
}
