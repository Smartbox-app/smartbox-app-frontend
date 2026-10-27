import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { refreshApiTableData } from 'src/actions/api-table';
import { successNotification } from 'src/actions/notifications';
import ApiService from 'src/services/api-service';

type MarkPeriodPaidVariables = {
  rentId: string;
  periodId: string;
};

type UseMarkPeriodPaidMutationOptions = {
  onSuccess?: () => void;
};

export const useMarkPeriodPaidMutation = (
  options?: UseMarkPeriodPaidMutationOptions,
) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['rent', 'period', 'mark-paid'],
    mutationFn: async ({ rentId, periodId }: MarkPeriodPaidVariables) => {
      await ApiService.callFetch(
        'PATCH',
        `rent/${rentId}/periods/${periodId}/paid`,
      );
    },
    onSuccess: () => {
      dispatch(successNotification('application.markPeriodAsPaidSuccess'));
      dispatch(refreshApiTableData());
      options?.onSuccess?.();
    },
  });
};
