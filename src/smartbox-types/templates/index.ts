export enum TemplateType {
    USER_BLOCKED_SMS = 'user_blocked_sms',
    USER_UNBLOCKED_SMS = 'user_unblocked_sms',
    USER_BLOCKED_EMAIL = 'user_blocked_email',
    USER_UNBLOCKED_EMAIL = 'user_unblocked_email',
    RENTAL_EXTENDED_SMS = 'rental_extended_sms',
    RENTAL_EXTENDED_MAIL = 'rental_extended_email',
    NEW_RENTAL_MAIL = 'new_rental_email',
    NEW_RENTAL_SMS = 'new_rental_sms',
    NO_PAYMENT_EMAIL = 'no_payment_email',
    NO_PAYMENT_SMS = 'no_payment_sms',
    BOX_CHANGED_EMAIL = 'box_changed_email',
    BOX_CHANGED_SMS = 'box_changed_sms',
    AUTO_PAYMENT_FAILED_EMAIL = 'auto_payment_failed_email',
    AUTO_PAYMENT_FAILED_SMS = 'auto_payment_failed_sms',
    EXTEND_RENTAL_EMAIL = 'extend_rental_email',
    EXTEND_RENTAL_SMS = 'extend_rental_sms',
    RENTAL_ENDS_TODAY_EMAIL = 'rental_ends_today_email',
    RENTAL_ENDS_TODAY_SMS = 'rental_ends_today_sms',
    ACCOUNT_ACTIVATED_EMAIL = 'account_activated_email',
    INVITE_USER_EMAIL = 'invite_user_email',
}

export type TemplateEntity = {
    type: TemplateType;
    content: string;
    tenantId: string;
    image?: string;
}

export type TemplateReq = Pick<TemplateEntity, 'content' | 'image'>