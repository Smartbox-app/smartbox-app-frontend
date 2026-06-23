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
) => {
  return useQuery({
    enabled: enabled && !!template,
    queryKey: template
      ? documentAgreementHtmlQueryKey(template)
      : ['document', 'agreement', 'html', 'missing'],
    queryFn: async () => {
      if (!template) return null;

      const query = agreementTemplateToQueryString(template);
      const url = query
        ? `document/type/agreement/html?${query}`
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
