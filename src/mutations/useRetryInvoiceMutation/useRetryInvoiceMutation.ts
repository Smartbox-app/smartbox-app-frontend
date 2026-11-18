import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { refreshApiTableData } from 'src/actions/api-table';
import { successNotification } from 'src/actions/notifications';
import ApiService from 'src/services/api-service';

export const useRetryInvoiceMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['payment', 'retry-invoice'],
    mutationFn: async (paymentId: string) => {
      await ApiService.callFetch('POST', `payment/${paymentId}/retry-invoice`);
    },
    onSuccess: () => {
      dispatch(successNotification('application.retryInvoiceSent'));
      dispatch(refreshApiTableData());
    },
  });
};
