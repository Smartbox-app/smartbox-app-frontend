import { AgreementTemplateInput } from 'smartbox-types';

export const agreementTemplateToQueryString = (
  template: AgreementTemplateInput,
): string => {
  const params = new URLSearchParams();

  (Object.entries(template) as [keyof AgreementTemplateInput, unknown][]).forEach(
    ([key, value]) => {
      if (value === undefined || value === null || value === '') return;

      if (key === 'addons') {
        const addonsValue =
          typeof value === 'string' ? value : JSON.stringify(value);
        if (addonsValue) params.append('addons', addonsValue);
        return;
      }

      params.append(key, String(value));
    },
  );

  return params.toString();
};

export const buildLegacyAgreementUrl = (
  tenantId: string,
  template: AgreementTemplateInput,
  apiBaseUrl: string,
): string => {
  const query = agreementTemplateToQueryString(template);
  return query
    ? `${apiBaseUrl}tenant/agreement/${tenantId}?${query}`
    : `${apiBaseUrl}tenant/agreement/${tenantId}`;
};
