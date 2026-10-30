import { FieldErrors } from 'react-hook-form';

import { scrollToElement } from 'src/utils/scroll-top';

const getFormFieldElement = (fieldName: string): HTMLElement | null => {
  const byId = document.getElementById(fieldName);
  if (byId) return byId;

  const byName = document.querySelector<HTMLElement>(`[name="${fieldName}"]`);
  if (byName) return byName;

  return null;
};

const scrollToFirstFormError = (
  errors: FieldErrors,
  fieldOrder: string[],
) => {
  const firstFieldName =
    fieldOrder.find((fieldName) => Boolean(errors[fieldName])) ??
    Object.keys(errors)[0];

  if (!firstFieldName) return;

  const fieldElement = getFormFieldElement(firstFieldName);
  const scrollTarget =
    fieldElement?.closest('label')?.parentElement ?? fieldElement;

  scrollToElement(scrollTarget);
};

export { scrollToFirstFormError };
