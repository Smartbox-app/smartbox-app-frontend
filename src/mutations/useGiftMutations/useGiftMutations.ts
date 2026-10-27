import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { GiftListRes, GiftRes } from 'smartbox-types';
import { refreshApiTableData } from 'src/actions/api-table';
import { successNotification } from 'src/actions/notifications';
import ApiService from 'src/services/api-service';

export const useDeleteGiftMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['gift', 'delete'],
    mutationFn: async (giftId: string) => {
      await ApiService.callFetch('DELETE', `gift/${giftId}`);
    },
    onSuccess: () => {
      dispatch(successNotification('application.giftDeleted'));
      dispatch(refreshApiTableData());
    },
  });
};

export const useToggleGiftMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['gift', 'toggle'],
    mutationFn: async (gift: GiftListRes) =>
      ApiService.callFetch<GiftRes>('PATCH', `gift/${gift.id}/toggle`),
    onSuccess: (updatedGift) => {
      if (!updatedGift) return;

      dispatch(
        successNotification(
          updatedGift.active
            ? 'application.giftActivated'
            : 'application.giftDeactivated',
        ),
      );
      dispatch(refreshApiTableData());
    },
  });
};
