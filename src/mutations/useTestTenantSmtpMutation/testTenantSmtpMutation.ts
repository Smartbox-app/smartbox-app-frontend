import { useMutation } from '@tanstack/react-query';
import ApiService from '../../services/api-service';

export type TestTenantSmtpRequestBody = {
  to: string;
};

export const useTestTenantSmtpMutation = (tenantId?: string) => {
  return useMutation({
    mutationKey: ['test-tenant-smtp'],
    mutationFn: async ({ body }: { body: TestTenantSmtpRequestBody }) => {
      await ApiService.callFetch(
        'POST',
        tenantId
          ? `tenant/admin/smtp-config/${tenantId}/test`
          : `tenant/smtp-config/test`,
        undefined,
        undefined,
        body,
        true,
      );
    },
  });
};
