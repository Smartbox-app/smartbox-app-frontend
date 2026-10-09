import { useQuery } from '@tanstack/react-query';
import { DocumentHtmlRes } from 'smartbox-types';
import type { AgreementTemplateInput } from '../../utils/agreement-template-query';
import ApiService from '../../services/api-service';
import { agreementTemplateToQueryString } from '../../utils/agreement-template-query';

export const documentAgreementHtmlQueryKey = (
  template: AgreementTemplateInput,
) => ['document', 'agreement', 'html', template] as const;

export const useGetDocumentAgreementHtmlQuery = (
  template?: AgreementTemplateInput,
  enabled = true,
  stockId?: string | null,
) => {
  return useQuery({
    enabled: enabled && !!template,
    queryKey: template
      ? [...documentAgreementHtmlQueryKey(template), stockId ?? 'default']
      : ['document', 'agreement', 'html', 'missing'],
    queryFn: async () => {
      if (!template) return null;

      const query = agreementTemplateToQueryString(template);
      const params = new URLSearchParams(query);

      if (stockId) {
        params.set('stockId', stockId);
      }

      const queryString = params.toString();
      let url = 'document/type/agreement/html';
      if (queryString) {
        url = `document/type/agreement/html?${queryString}`;
      } else if (stockId) {
        url = `document/type/agreement/html?stockId=${encodeURIComponent(stockId)}`;
      }

      const response = await ApiService.callFetch<DocumentHtmlRes>(
        'GET',
        url,
        undefined,
        undefined,
        undefined,
        false,
        true,
      );

      return response ?? null;
    },
    retry: false,
  });
};
