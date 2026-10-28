import { FormFieldBase, FormFieldType } from '../../formBuilder';
import { TranslatableError } from '../utils/translatableError';
import { requiredValidator } from '../validators';
import { FormFieldStaticSelect } from './staticSelect';

export interface FormFieldText extends FormFieldBase {
  type: FormFieldType.Text;
  value?: string;
  options?: {
    type?: string;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    descriptionBelow?: boolean;
  };
}

export function defaultEmptyVal(field: FormFieldText): any {
  return '';
}

export function formDataStrToRealValue(str: string, field: FormFieldText): any {
  return str;
}

export async function defaultOptionsValidator(field: Required<FormFieldText>) {
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

export function createTextField(
  field: Pick<FormFieldText, Exclude<keyof FormFieldText, 'type'>>
): FormFieldText {
  if (field.required === true) {
    field.validators = field.validators || [];
    field.validators.push(requiredValidator());
  }

  return {
    ...field,
    type: FormFieldType.Text,
  };
}
