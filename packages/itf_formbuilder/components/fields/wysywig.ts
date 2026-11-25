import {FormFieldBase, FormFieldType} from '../../formBuilder';
import {TranslatableError} from "../utils/translatableError";
import {requiredValidator} from "../validators";
import {FormFieldTextarea} from "./textarea";

export interface FormFieldWysywig extends FormFieldBase {
  type: FormFieldType.Wysywig;
  value?: string;
  options?: {
    minLength?: number,
    maxLength?: number,
  };
}

export function defaultEmptyVal(field: FormFieldWysywig): any {
  return '';
}

export function formDataStrToRealValue(str: string, field: FormFieldWysywig): any {
  return str;
}

export async function defaultOptionsValidator(field: Required<FormFieldWysywig>) {
  const {value, options} = field;
  const {minLength, maxLength} = options;

  if (typeof value !== 'string'){
      throw new TranslatableError('Invalid type of value: {0} expected.', 'string');
  }

  if (typeof minLength === 'number'){
    if (value.length < minLength){
        throw new TranslatableError('Value too short (min. {0})', minLength);
    }
  }

  if (typeof maxLength === 'number'){
    if (value.length > maxLength){
        throw new TranslatableError('Value too long (max. {0})', maxLength);
    }
  }
}

export function createWysywigField(field: Pick<FormFieldWysywig, Exclude<keyof FormFieldWysywig, 'type'>>): FormFieldWysywig {
  if (field.required === true) {
    field.validators = field.validators || [];
    field.validators.push(requiredValidator());
  }

  return {
    ...field,
    type: FormFieldType.Wysywig,
  };
}