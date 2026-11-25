import { FormFieldBase, FormFieldType } from '../../formBuilder';
import { TranslatableError } from '../utils/translatableError';
import { requiredValidator } from '../validators';
import { FormFieldCheckbox } from './checkbox';

interface ValuesStrKeyObj {
  [key: string]: string;
}

interface ValuesNumKeyObj {
  [key: number]: string;
}

interface SelectOption {
  value: string | number | boolean;
  name: string | number;
}

export interface FormFieldStaticSelect extends FormFieldBase {
  type: FormFieldType.StaticSelect;
  value?: null | string | string[] | number | number[] | boolean | boolean[];
  options?: {
    possibleValues: ValuesStrKeyObj | ValuesNumKeyObj | SelectOption[];
    multipleChoices?: boolean;
    useReactSelectComponent?: boolean;
    creatable?: boolean;
    translateValues?: boolean;
    translateCreatedValue?: boolean;
    descriptionBelow?: boolean;
  };
}

export function defaultEmptyVal(field: Required<FormFieldStaticSelect>): any {
  const { options } = field;
  const multipleChoices = options ? options.multipleChoices : false;

  if (multipleChoices === true) {
    return [];
  }

  return null;
}

export function formDataStrToRealValue(
  str: string,
  field: FormFieldStaticSelect
): any {
  if (field.options && field.options.multipleChoices) {
    return str.split(',').map((s) => s.trim());
  } else {
    return str;
  }
}

export async function defaultOptionsValidator(
  field: Required<FormFieldStaticSelect>
) {
  const { value, options } = field;
  const { multipleChoices, possibleValues, creatable } = options;

  if (multipleChoices !== true) {
    if (['string', 'number'].indexOf(typeof value) === -1 && value !== null) {
      throw new TranslatableError(
        'Invalid type of value: {0} expected.',
        'string or number'
      );
    }
    if (
      !creatable &&
      value !== null &&
      !Array.isArray(possibleValues) &&
      !possibleValues.hasOwnProperty(value as string)
    ) {
      throw new TranslatableError('Invalid option: {0}.', value);
    } else if (
      !creatable &&
      value !== null &&
      Array.isArray(possibleValues) &&
      !(possibleValues as SelectOption[]).find((o) => o.value === value) &&
      !possibleValues.hasOwnProperty(value as string)
    ) {
      throw new TranslatableError('Invalid option: {0}.', value);
    }
  } else {
    if (
      typeof (value as any[]).push !== 'undefined' &&
      (value as any[]).length !== 0 &&
      ['string', 'number'].indexOf(typeof (value as any[])[0]) === -1
    ) {
      throw new TranslatableError(
        'Invalid type of value: {0} expected.',
        'array of strings or array of numbers'
      );
    }

    for (let val of value as any[]) {
      if (
        !creatable &&
        value !== null &&
        !Array.isArray(possibleValues) &&
        !possibleValues.hasOwnProperty(val as string)
      ) {
        throw new TranslatableError('Invalid option: {0}.', value);
      } else if (
        !creatable &&
        value !== null &&
        Array.isArray(possibleValues) &&
        !(possibleValues as SelectOption[]).find((o) => o.value === val) &&
        !possibleValues.hasOwnProperty(value as string)
      ) {
        throw new TranslatableError('Invalid option: {0}.', value);
      }
    }
  }
}

export function createStaticSelectField(
  field: Pick<
    FormFieldStaticSelect,
    Exclude<keyof FormFieldStaticSelect, 'type'>
  >
): FormFieldStaticSelect {
  if (field.required === true) {
    field.validators = field.validators || [];
    field.validators.push(requiredValidator());
  }

  return {
    ...field,
    type: FormFieldType.StaticSelect,
  };
}
