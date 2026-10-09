import type { AppDispatch } from 'src/types/app-dispatch';
import ApiService from '../services/api-service';
import { apiTable } from './index';
import { successNotification } from './notifications';

export const deleteSentInvitations = (invitationId: string) => async (dispatch: AppDispatch) => {
  await ApiService.delete(
    dispatch,
    '',
    '',
    () => {
      dispatch(successNotification('notification.invitationDeleted'));
      dispatch(apiTable.refreshApiTableData());
    },
    null,
    `user/invitation/${invitationId}`,
  );
};

export const resendInvitations = (invitationId: string) => async (dispatch: AppDispatch) => {
  await ApiService.get(
    dispatch,
    '',
    '',
    () => {
      dispatch(successNotification('notification.invitationResent'));
    },
    null,
    `user/resend-invitation/${invitationId}`,
  );
};
