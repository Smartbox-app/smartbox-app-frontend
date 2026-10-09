export enum TemplateType {
  USER_BLOCKED_SMS = 'user_blocked_sms',
  USER_UNBLOCKED_SMS = 'user_unblocked_sms',
  USER_BLOCKED_EMAIL = 'user_blocked_email',
  USER_UNBLOCKED_EMAIL = 'user_unblocked_email',
  RENTAL_EXTENDED_SMS = 'rental_extended_sms',
  RENTAL_EXTENDED_MAIL = 'rental_extended_email',
  RENTAL_EXTENDED_ADMIN_NOTIFICATION_MAIL = 'rental_extended_admin_notification_email',
  RENTAL_PERIOD_PAID_MAIL = 'rental_period_paid_email',
  RENTAL_PERIOD_PAID_ADMIN_NOTIFICATION_MAIL = 'rental_period_paid_admin_notification_email',
  NEW_RENTAL_MAIL = 'new_rental_email',
  NEW_RENTAL_ADMIN_NOTIFICATION_MAIL = 'new_rental_admin_notification_email',
  NEW_RENTAL_SMS = 'new_rental_sms',
  RENT_ENDED_MAIL = 'rent_ended_email',
  RENT_ENDED_ADMIN_NOTIFICATION_MAIL = 'rent_ended_admin_notification_email',
  RENT_ENDED_SMS = 'rent_ended_sms',
  NO_PAYMENT_EMAIL = 'no_payment_email',
  NO_PAYMENT_SMS = 'no_payment_sms',
  NO_PERIOD_PAYMENT_EMAIL = 'no_period_payment_email',
  NO_PERIOD_PAYMENT_SMS = 'no_period_payment_sms',
  BOX_CHANGED_EMAIL = 'box_changed_email',
  BOX_CHANGED_SMS = 'box_changed_sms',
  AUTO_PAYMENT_FAILED_EMAIL = 'auto_payment_failed_email',
  AUTO_PAYMENT_FAILED_SMS = 'auto_payment_failed_sms',
  EXTEND_RENTAL_EMAIL = 'extend_rental_email',
  EXTEND_RENTAL_SMS = 'extend_rental_sms',
  RENTAL_ENDS_TODAY_EMAIL = 'rental_ends_today_email',
  RENTAL_ENDS_TODAY_SMS = 'rental_ends_today_sms',
  RENTAL_ENDS_IN_3_DAYS_EMAIL = 'rental_ends_in_3_days_email',
  RENTAL_ENDS_IN_3_DAYS_SMS = 'rental_ends_in_3_days_sms',
  PERIOD_PAYMENT_ENDS_EMAIL = 'period_payment_ends',
  PERIOD_PAYMENT_ENDS_SMS = 'period_payment_ends_sms',
  ACCOUNT_ACTIVATED_EMAIL = 'account_activated_email',
  ACCOUNT_ACTIVATION_SMS = 'account_activation_sms',
  INVITE_USER_EMAIL = 'invite_user_email',
  PERIOD_PAYMENT_EMAIL = 'period_payment_email',
  PERIOD_PAYMENT_SMS = 'period_payment_sms',
  RENTAL_PERIOD_PAID_SMS = 'rental_period_paid_sms',
  BOX_GROUP_FREE_EMAIL = 'box_group_free_email',
  BOX_GROUP_FREE_SMS = 'box_group_free_sms',
  ACCESS_CODE_EMAIL = 'access_code_email',
  ACCESS_CODE_SMS = 'access_code_sms',
  GATE_ACCESS_CODE_EMAIL = 'gate_access_code_email',
  GATE_ACCESS_CODE_SMS = 'gate_access_code_sms',
  OPEN_ENDED_NEW_RENTAL_MAIL = 'open_ended_new_rental_email',
  OPEN_ENDED_NEW_RENTAL_SMS = 'open_ended_new_rental_sms',
  OPEN_ENDED_NEW_RENTAL_ADMIN_NOTIFICATION_MAIL = 'open_ended_new_rental_admin_notification_email',
  OPEN_ENDED_PERIOD_PAYMENT_EMAIL = 'open_ended_period_payment_email',
  OPEN_ENDED_PERIOD_PAYMENT_SMS = 'open_ended_period_payment_sms',
  OPEN_ENDED_RENTAL_PERIOD_PAID_MAIL = 'open_ended_rental_period_paid_email',
  OPEN_ENDED_RENTAL_PERIOD_PAID_SMS = 'open_ended_rental_period_paid_sms',
  OPEN_ENDED_RENTAL_PERIOD_PAID_ADMIN_NOTIFICATION_MAIL = 'open_ended_rental_period_paid_admin_notification_email',
  OPEN_ENDED_NO_PERIOD_PAYMENT_EMAIL = 'open_ended_no_period_payment_email',
  OPEN_ENDED_NO_PERIOD_PAYMENT_SMS = 'open_ended_no_period_payment_sms',
  OPEN_ENDED_PERIOD_PAYMENT_ENDS_EMAIL = 'open_ended_period_payment_ends_email',
  OPEN_ENDED_PERIOD_PAYMENT_ENDS_SMS = 'open_ended_period_payment_ends_sms',
  OPEN_ENDED_PERIOD_PAYMENT_DUE_TODAY_EMAIL = 'open_ended_period_payment_due_today_email',
  OPEN_ENDED_PERIOD_PAYMENT_DUE_TODAY_SMS = 'open_ended_period_payment_due_today_sms',
  OPEN_ENDED_PERIOD_PAYMENT_MID_WINDOW_EMAIL = 'open_ended_period_payment_mid_window_email',
  OPEN_ENDED_PERIOD_PAYMENT_MID_WINDOW_SMS = 'open_ended_period_payment_mid_window_sms',
  OPEN_ENDED_AGREEMENT_ENDED_ADMIN_NOTIFICATION_MAIL = 'open_ended_agreement_ended_admin_notification_email',
  OPEN_ENDED_RENT_ENDED_MAIL = 'open_ended_rent_ended_email',
  OPEN_ENDED_RENT_ENDED_SMS = 'open_ended_rent_ended_sms',
  OPEN_ENDED_RENT_ENDED_ADMIN_NOTIFICATION_MAIL = 'open_ended_rent_ended_admin_notification_email',
  OPEN_ENDED_RENT_ENDED_UNPAID_MAIL = 'open_ended_rent_ended_unpaid_email',
  OPEN_ENDED_RENT_ENDED_UNPAID_SMS = 'open_ended_rent_ended_unpaid_sms',
  OPEN_ENDED_RENT_ENDED_UNPAID_ADMIN_NOTIFICATION_MAIL = 'open_ended_rent_ended_unpaid_admin_notification_email',
  OPEN_ENDED_RECOVER_ACCESS_ENDS_IN_2_DAYS_EMAIL = 'open_ended_recover_access_ends_in_2_days_email',
  OPEN_ENDED_RECOVER_ACCESS_ENDS_IN_2_DAYS_SMS = 'open_ended_recover_access_ends_in_2_days_sms',
  OPEN_ENDED_RECOVER_ACCESS_ENDS_TODAY_EMAIL = 'open_ended_recover_access_ends_today_email',
  OPEN_ENDED_RECOVER_ACCESS_ENDS_TODAY_SMS = 'open_ended_recover_access_ends_today_sms',
}

const tenantOnlyTemplateTypes = new Set<TemplateType>([
  TemplateType.INVITE_USER_EMAIL,
  TemplateType.ACCOUNT_ACTIVATED_EMAIL,
  TemplateType.ACCOUNT_ACTIVATION_SMS,
  TemplateType.USER_BLOCKED_EMAIL,
  TemplateType.USER_BLOCKED_SMS,
  TemplateType.USER_UNBLOCKED_EMAIL,
  TemplateType.USER_UNBLOCKED_SMS,
]);

export const stockScopedTemplateTypes = new Set(
  Object.values(TemplateType).filter((type) => !tenantOnlyTemplateTypes.has(type)),
);

export const isStockScopedTemplate = (type: TemplateType) =>
  stockScopedTemplateTypes.has(type);

export type TemplateStockRef = {
  id: string;
  name: string;
};

export type TemplateEntity = {
  type: TemplateType;
  content: string;
  tenantId: string;
  image?: string;
};

export type TemplateListItem = TemplateEntity & {
  id: string;
  stocks: TemplateStockRef[];
};

export type TemplateReq = Pick<TemplateEntity, 'content' | 'image'> & {
  stockIds?: string[] | string;
};

export type TemplateListRow = {
  id: string;
  type: TemplateType;
  channel: 'email' | 'sms';
  stockNames: string;
  forStock: boolean;
  isDefault: boolean;
  canOverride: boolean;
};
