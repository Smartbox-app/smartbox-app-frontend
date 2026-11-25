import { FormFieldBase, FormFieldType } from "../../formBuilder";

export interface FormFieldFileDragDrop extends FormFieldBase {
  type: FormFieldType.FileDragDrop;
  value?: any;
  options?: {
    isNotImage?: boolean;
    previewUrl?: string;
    accept?: string;
  };
}

export function defaultEmptyVal(field: FormFieldFileDragDrop): any {
  return null; // This has no meaning, as Mutler will handle that
}

export async function defaultOptionsValidator(field: FormFieldFileDragDrop) {}

export function formDataStrToRealValue(
  str: any,
  field: FormFieldFileDragDrop
): any {
  return str; // This is not str - it should be FormData File if sent like this Or it doesn't even exists as Mutler takes it
}

export function createFileDragDropField(
  field: Pick<
    FormFieldFileDragDrop,
    Exclude<keyof FormFieldFileDragDrop, "type">
  >
): FormFieldFileDragDrop {
  return {
    ...field,
    type: FormFieldType.FileDragDrop
  };
}
