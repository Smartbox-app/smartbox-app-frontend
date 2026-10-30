import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { successNotification } from 'src/actions/notifications';
import { history } from 'src/history';
import ApiService from 'src/services/api-service';

type EmailVerificationVariables = {
  userId: string;
  updateToken: string;
  pwd?: string;
  pwd2?: string;
};

type UseEmailVerificationMutationOptions = {
  onSuccess?: () => void;
};

export const useEmailVerificationMutation = (
  options?: UseEmailVerificationMutationOptions,
) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['user', 'email-verification'],
    mutationFn: async ({
      userId,
      updateToken,
      pwd,
      pwd2,
    }: EmailVerificationVariables) => {
      const body =
        pwd || pwd2
          ? {
              ...(pwd ? { pwd } : {}),
              ...(pwd2 ? { pwd2 } : {}),
            }
          : {};

      await ApiService.callFetch(
        'POST',
        `user/active/${userId}/${updateToken}`,
        undefined,
        undefined,
        body,
      );
    },
    onSuccess: (_data, variables) => {
      dispatch(
        successNotification(
          variables.pwd
            ? 'notification.accountHasBeenActivated'
            : 'notification.useEmailVerificationSuccess',
        ),
      );
      history.push(variables.pwd ? '/login' : '/');
      options?.onSuccess?.();
    },
  });
};
