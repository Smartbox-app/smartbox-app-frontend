export interface TenantEntity {
    id: string;
    name: string;
    identifier: string;
    colorPrimary: string;
    colorSecondary: string;
    logo: string;
    icon: string;
    background: string;
    slides: string[];
    contactPhone: string;
    contactEmail: string;
    fontLight: string;
    fontNormal: string;
    fontBold: string;
    allowedBoxesCount: number;
    allowedStocksCount: number;
    additionalMailInfo: string;
    tax: string;
    invoiceServiceApiKey: string;
    invoiceServiceDomain: string;
    smsName: string;
    rules: string;
    privacy: string;
    agreement: string;
    storeId: string;
    sharedSecret: string;
    allowAddonsToRent: boolean;
}

export type UpdateTenantReq = Pick<TenantEntity, 'colorPrimary' | 'colorSecondary' | 'name' | 'identifier' | 'contactEmail' | 'contactPhone' | 'additionalMailInfo' | 'tax'>;
export type UpdateTenantByAdminReq = Pick<TenantEntity, 'colorPrimary' | 'colorSecondary' | 'name' | 'identifier' | 'contactEmail' | 'contactPhone' | 'allowedBoxesCount' | 'allowedStocksCount' | 'additionalMailInfo' | 'tax' | 'invoiceServiceApiKey' | 'invoiceServiceDomain' | 'smsName' | 'storeId' | 'sharedSecret' | 'allowAddonsToRent'>;
export type TenantForUsers = Omit<TenantEntity, 'allowedBoxesCount' | 'allowedStocksCount'>;