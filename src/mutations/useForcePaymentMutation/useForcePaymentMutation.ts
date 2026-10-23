import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import ApiService from '../../services/api-service';
import { refreshApiTableData } from '../../actions/api-table';
import { successNotification } from '../../actions/notifications';

export type ForcePaymentAction = 'accept' | 'cancel';

type ForcePaymentVariables = {
  rentId: string;
  paymentId: string;
  action: ForcePaymentAction;
};

type UseForcePaymentMutationOptions = {
  onSuccess?: () => void;
};

export const useForcePaymentMutation = (
  options?: UseForcePaymentMutationOptions,
) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['payment', 'force'],
    mutationFn: async ({ rentId, paymentId, action }: ForcePaymentVariables) => {
      const path =
        action === 'accept'
          ? `rent/payment/force/${rentId}/${paymentId}`
          : `rent/payment/force-cancel/${rentId}/${paymentId}`;

      await ApiService.callFetch('POST', path);
    },
    onSuccess: (_data, variables) => {
      dispatch(
        successNotification(
          variables.action === 'accept'
            ? 'application.forcePaymentAcceptanceSuccess'
            : 'application.forcePaymentCancellationSuccess',
        ),
      );
      dispatch(refreshApiTableData());
      options?.onSuccess?.();
    },
  });
};
