import { useDispatch } from 'react-redux';

import { invitationList } from 'smartbox-tables';
import { UserInvitationListItem } from 'smartbox-types';
import { showModal } from 'src/actions/modal';
import { Button } from 'src/components/Branded';
import { ApiTable, ConfirmModal } from 'src/components/Common';
import { Section, ButtonsContainer } from 'src/components/Layout';
import { HeaderWithActions } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import {
  useDeleteInvitationMutation,
  useResendInvitationMutation,
} from 'src/mutations';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';

export const InvitesSent = () => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();
  const { mutate: resendInvitation } = useResendInvitationMutation();
  const { mutate: deleteInvitation } = useDeleteInvitationMutation();

  const scheme = new InteractiveTableSchema(invitationList).addFieldAtTheEnd({
    name: __('application.actions'),
    field: 'actions',
    mobile: true,
    buttons: [
      {
        name: 'application.resend',
        type: 'primary',
        click: (data: UserInvitationListItem) => resendInvitation(data.id),
      },
      {
        name: 'application.delete',
        type: 'danger',
        click: (data: UserInvitationListItem) =>
          dispatch(
            showModal(
              <ConfirmModal
                approveButtonText="application.delete"
                mainText="application.doYouWantDeleteInvite"
                cancelButtonText="application.cancel"
                approveAction={() => deleteInvitation(data.id)}
              />,
            ),
          ),
      },
    ],
  });

  return (
    <Section>
      <HeaderWithActions
        actions={
          <ButtonsContainer>
            <Button
              text="application.inviteUser"
              primary
              to={`/${UserService.getSlugByRole(user!.role)}/management/users/invite`}
            />
          </ButtonsContainer>
        }
      >
        {__('application.inviteList')}
      </HeaderWithActions>

      <ApiTable scheme={scheme} apiEndpointSubUrl="user/invitation-list" />
    </Section>
  );
};
