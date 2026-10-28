import { FormFieldBase, FormFieldType } from "../../formBuilder";

export interface HeaderField extends FormFieldBase {
  type: FormFieldType.Header;
}

export function defaultEmptyVal(field: HeaderField): any {
  return null;
}

export async function defaultOptionsValidator(field: Required<HeaderField>) {}

export function formDataStrToRealValue(str: string, field: HeaderField): any {
  return null;
}

export function createHeaderField(
  fieldId: string,
  title: string = "",
  visibilityAndActivity?: (allValues: any) => boolean | Promise<boolean>,
  valueOnInactivity?: any
): HeaderField {
  const field: any = {
    id: fieldId,
    title: title,
    visibilityAndActivity: visibilityAndActivity,
    valueOnInactivity: valueOnInactivity,
  };

  return {
    ...field,
    type: FormFieldType.Header,
  };
}
