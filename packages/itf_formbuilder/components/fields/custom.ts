import { FormFieldBase, FormFieldType } from "../../formBuilder";

export interface CustomField extends FormFieldBase {
  type: FormFieldType.Custom;
}

export function defaultEmptyVal(field: CustomField): any {
  return null;
}

export async function defaultOptionsValidator(field: Required<CustomField>) {}

export function formDataStrToRealValue(str: string, field: CustomField): any {
  return null;
}

export function createCustomField(
  fieldId: string,
  value: string | any,
  title: string = ""
): CustomField {
  const field: any = {
    id: fieldId,
    title: title,
    value: value
  };

  return {
    ...field,
    type: FormFieldType.Custom
  };
}
