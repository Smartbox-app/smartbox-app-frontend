import { useQuery } from '@tanstack/react-query';
import { AgreementTemplateInput, DocumentHtmlRes } from 'smartbox-types';
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
      const url = queryString
        ? `document/type/agreement/html?${queryString}`
        : stockId
          ? `document/type/agreement/html?stockId=${encodeURIComponent(stockId)}`
          : 'document/type/agreement/html';

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
