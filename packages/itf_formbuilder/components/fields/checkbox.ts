import {FormFieldBase, FormFieldType} from '../../formBuilder';
import { requiredValidator } from '../validators/required';
import {TranslatableError} from "../utils/translatableError";

export interface FormFieldCheckbox extends FormFieldBase {
  type: FormFieldType.Checkbox;
  value?: boolean;
  options?: {};
}

export function defaultEmptyVal(field: FormFieldCheckbox): any {
  return false;
}

export async function defaultOptionsValidator(field: FormFieldCheckbox) {
  const { value } = field;

  if (typeof value !== 'boolean') {
    throw new TranslatableError('Invalid type of value: {0} expected.', 'boolean');
  }
}

export function formDataStrToRealValue(str: string, field: FormFieldCheckbox): any {
  switch(str) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      throw new TranslatableError('Invalid type of value: {0} expected.', 'boolean');
  }
}

export function createCheckboxField(field: Pick<FormFieldCheckbox, Exclude<keyof FormFieldCheckbox, 'type'>>): FormFieldCheckbox {
  if (field.required === true) {
    field.validators = field.validators || [];
    field.validators.push(requiredValidator());
  }

  return {
      ...field,
      type: FormFieldType.Checkbox,
  };
}