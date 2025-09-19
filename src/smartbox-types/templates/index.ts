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
  INVITE_USER_EMAIL = 'invite_user_email',
  PERIOD_PAYMENT_EMAIL = 'period_payment_email',
  PERIOD_PAYMENT_SMS = 'period_payment_sms',
  RENTAL_PERIOD_PAID_SMS = 'rental_period_paid_sms',
  BOX_GROUP_FREE_EMAIL = 'box_group_free_email',
  BOX_GROUP_FREE_SMS = 'box_group_free_sms',
}

export type TemplateEntity = {
  type: TemplateType;
  content: string;
  tenantId: string;
  image?: string;
};

export type TemplateReq = Pick<TemplateEntity, 'content' | 'image'>;
