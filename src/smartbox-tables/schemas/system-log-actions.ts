import { __ } from '../../helpers/i18n';

export const translateSystemLogAction = (
  action: string | null | undefined,
): string => {
  if (!action) return '-';
  const key = `application.systemLogActions.${action}`;
  const label = __(key);
  return label === key ? action : label;
};
