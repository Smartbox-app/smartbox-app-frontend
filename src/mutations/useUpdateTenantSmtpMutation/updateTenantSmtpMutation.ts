import { useMutation, useQueryClient } from '@tanstack/react-query';

import ApiService from 'src/services/api-service';

export type UpdateTenantSmtpBody = {
  useCustomSmtp: boolean;
  smtpHost: string | null;
  smtpPort: number | null;
  smtpUser: string | null;
  smtpPassword?: string | null;
  smtpSecure: boolean;
  smtpIgnoreTls: boolean;
  smtpFromEmail: string | null;
};

export const useUpdateTenantSmtpMutation = (tenantOwnerId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-tenant-smtp'],
    mutationFn: async ({
      body,
    }: {
      body: UpdateTenantSmtpBody;
    }) => {
      const url = tenantOwnerId ? `tenant/admin/smtp-config/${tenantOwnerId}` : 'tenant/smtp-config';
      await ApiService.callFetch(
        'PATCH',
        url,
        undefined,
        undefined,
        body,
        true,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tenant-smtp-config', tenantOwnerId]
      });
    },
  });
};
