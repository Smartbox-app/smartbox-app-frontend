import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { refreshApiTableData } from 'src/actions/api-table';
import { successNotification } from 'src/actions/notifications';
import { queryClient } from 'src/query-client';
import ApiService from 'src/services/api-service';

type DeleteStockVariables = {
  stockId: string;
  stockName: string;
  successMessage: string;
};

export const useDeleteStockMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['stock', 'delete'],
    mutationFn: async ({ stockId, stockName }: DeleteStockVariables) => {
      await ApiService.callFetch(
        'DELETE',
        `stock/${stockId}/${stockName}`,
      );
    },
    onSuccess: (_data, variables) => {
      dispatch(successNotification(variables.successMessage));
      dispatch(refreshApiTableData());
      void queryClient.invalidateQueries({ queryKey: ['stock'] });
      void queryClient.invalidateQueries({ queryKey: ['stock-group'] });
    },
  });
};
