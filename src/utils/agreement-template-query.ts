export type AgreementTemplateInput = {
  finishAt?: string | null;
  cost?: string;
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  postCode?: string;
  isCompany?: string;
  phone?: string;
  birthDate?: string;
  mailToSendInvoice?: string;
  companyName?: string;
  companyStreet?: string;
  companyCity?: string;
  companyPostCode?: string;
  nip?: string | null;
  simplifiedAddons?: unknown;
  date?: string;
  startAt?: string;
  email?: string;
  size?: string;
  area?: string | number;
  stockName?: string;
  stockAddress?: string;
  addons?: unknown;
  stockId?: string | null;
};

export const agreementTemplateToQueryString = (
  template: AgreementTemplateInput,
): string => {
  const params = new URLSearchParams();

  (Object.entries(template) as [string, unknown][]).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (key === 'addons') {
      const addonsValue =
        typeof value === 'string' ? value : JSON.stringify(value);
      if (addonsValue) params.append('addons', addonsValue);
      return;
    }

    params.append(key, String(value));
  });

  return params.toString();
};

export const buildLegacyAgreementPath = (
  tenantId: string,
  template: AgreementTemplateInput,
): string => {
  const query = agreementTemplateToQueryString(template);
  return query
    ? `tenant/agreement/${tenantId}?${query}`
    : `tenant/agreement/${tenantId}`;
};

export const buildLegacyAgreementUrl = (
  tenantId: string,
  template: AgreementTemplateInput,
  apiBaseUrl: string,
): string => `${apiBaseUrl}${buildLegacyAgreementPath(tenantId, template)}`;
