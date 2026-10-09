export interface AppSettingsEntity {
    invoiceDescription: string;
    tax: string;
    version: string;
    webMessage: string;
    androidMessage: string;
    iosMessage: string;
    mobileMessage: string;
}

export interface AppVersionResponse {
    version: string;
    message: string;
}

export type UpdateSettingsReq = Pick<
    AppSettingsEntity,
    'version' | 'webMessage' | 'androidMessage' | 'iosMessage' | 'mobileMessage'
>;