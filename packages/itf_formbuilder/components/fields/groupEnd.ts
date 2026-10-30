import { FormFieldBase, FormFieldType } from "../../formBuilder";

export interface FormFieldGroupEnd extends FormFieldBase {
  type: FormFieldType.GroupEnd;
}

export function defaultEmptyVal(field: FormFieldGroupEnd): any {
  return null;
}

export async function defaultOptionsValidator(
  field: Required<FormFieldGroupEnd>
) {}

export function formDataStrToRealValue(
  str: string,
  field: FormFieldGroupEnd
): any {
  return null;
}

export function createGroupEndField(id: string): FormFieldGroupEnd {
  const field: any = {
    id,
    title: ""
  };

  return {
    ...field,
    type: FormFieldType.GroupEnd
  };
}
