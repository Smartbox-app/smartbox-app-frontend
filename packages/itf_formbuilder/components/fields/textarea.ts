import { FormFieldBase, FormFieldType } from '../../formBuilder';
import { TranslatableError } from '../utils/translatableError';
import { requiredValidator } from '../validators';
import { FormFieldText } from './text';

export interface FormFieldTextarea extends FormFieldBase {
  type: FormFieldType.Textarea;
  value?: string;
  options?: {
    minLength?: number;
    maxLength?: number;
    descriptionBelow?: boolean;
  };
}

export function defaultEmptyVal(field: FormFieldTextarea): any {
  return '';
}

export function formDataStrToRealValue(
  str: string,
  field: FormFieldTextarea
): any {
  return str;
}

export async function defaultOptionsValidator(
  field: Required<FormFieldTextarea>
) {
  const { value, options } = field;
  const { minLength, maxLength } = options;

  if (typeof value !== 'string') {
    throw new TranslatableError(
      'Invalid type of value: {0} expected.',
      'string'
    );
  }

  if (typeof minLength === 'number') {
    if (value.length < minLength) {
      throw new TranslatableError('Value too short (min. {0})', minLength);
    }
  }

  if (typeof maxLength === 'number') {
    if (value.length > maxLength) {
      throw new TranslatableError('Value too long (max. {0})', maxLength);
    }
  }
}

export function createTextareaField(
  field: Pick<FormFieldTextarea, Exclude<keyof FormFieldTextarea, 'type'>>
): FormFieldTextarea {
  if (field.required === true) {
    field.validators = field.validators || [];
    field.validators.push(requiredValidator());
  }

  return {
    ...field,
    type: FormFieldType.Textarea,
  };
}
