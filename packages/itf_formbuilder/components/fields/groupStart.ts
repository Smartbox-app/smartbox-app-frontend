import { FormFieldBase, FormFieldType } from "../../formBuilder";

export interface FormFieldGroupStart extends FormFieldBase {
  type: FormFieldType.GroupStart;
}

export function defaultEmptyVal(field: FormFieldGroupStart): any {
  return null;
}

export async function defaultOptionsValidator(
  field: Required<FormFieldGroupStart>
) {}

export function formDataStrToRealValue(): any {
  return null;
}

export function createGroupStartField(id: string): FormFieldGroupStart {
  const field: any = {
    id,
    title: ""
  };

  return {
    ...field,
    type: FormFieldType.GroupStart
  };
}
