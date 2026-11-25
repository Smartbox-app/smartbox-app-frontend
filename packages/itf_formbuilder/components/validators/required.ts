import {FormBuilder, FormFieldAsyncOrSyncValidator, FormFieldBase} from '../../formBuilder';
import {TranslatableError} from "../utils/translatableError";

export function requiredValidator(): FormFieldAsyncOrSyncValidator {
  return async (field) => {
    const f = field as any as FormFieldBase;
    if (!f.required === true) return;
    const defEmptyVal = FormBuilder.getFieldEmptyVal(f);
    if (f.value === defEmptyVal){
      throw new TranslatableError('Field required.');
    }
  };
}