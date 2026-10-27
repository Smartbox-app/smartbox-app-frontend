import { useMutation, useQueryClient } from '@tanstack/react-query';

import { myRentDetailsQueryKey } from 'src/queries';
import ApiService from 'src/services/api-service';
import { getEndRentSource } from 'src/utils/can-capture-end-rent-photo';

export const useEndMyRentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['end-my-rent'],
    mutationFn: async ({
      rentId,
      photo,
      photoTakenAt,
    }: {
      rentId: string;
      photo?: File | null;
      photoTakenAt?: Date | null;
    }) => {
      const source = getEndRentSource();
      const formData = new FormData();

      if (photo) {
        formData.append('file', photo, photo.name);
      }

      if (photoTakenAt) {
        formData.append('endRentPhotoTakenAt', photoTakenAt.toISOString());
      }

      await ApiService.callFetch(
        'POST',
        `rent/end/${rentId}?source=${source}`,
        undefined,
        undefined,
        formData,
        true,
      );
    },
    onSuccess: (_data, { rentId }) => {
      queryClient.invalidateQueries({ queryKey: ['my-rents'] });
      queryClient.invalidateQueries({ queryKey: ['my-rent-story'] });
      queryClient.invalidateQueries({
        queryKey: myRentDetailsQueryKey(rentId),
      });
      queryClient.invalidateQueries({
        queryKey: ['rent-authorized-users', rentId],
      });
    },
  });
};
