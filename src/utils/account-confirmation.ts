import {
  AccountConfirmationMethod,
  TenantForUsers,
} from 'smartbox-types';

export const isSmsAccountConfirmation = (
  tenant: Pick<TenantForUsers, 'accountConfirmationMethodEffective'>,
): boolean =>
  tenant.accountConfirmationMethodEffective ===
  AccountConfirmationMethod.sms_code;
