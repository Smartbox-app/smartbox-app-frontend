import React from 'react';
import { useDispatch } from 'react-redux';
import { invitationList } from 'smartbox-tables';
import { Section, ButtonsContainer } from '../../../components/Layout';
import { ApiTable, ConfirmModal } from '../../../components/Common';
import { Button } from '../../../components/Branded';
import { InteractiveTableSchema } from '../../../utils/table-schema-utils';
import { __ } from '../../../helpers/i18n';
import { HeaderWithActions } from 'src/components/ui';
import UserService from 'src/services/user-service';
import { useGetMyDetailsQuery } from 'src/queries';
import {
  deleteSentInvitations,
  resendInvitations,
} from 'src/actions/invitations';
import { showModal } from 'src/actions/modal';

export const InvitesSent = () => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();
  const scheme = new InteractiveTableSchema(invitationList).addFieldAtTheEnd({
    name: __('application.actions'),
    field: 'actions',
    mobile: true,
    buttons: [
      {
        name: 'application.resend',
        type: 'primary',
        click: (data: any) => dispatch(resendInvitations(data.id)),
      },
      {
        name: 'application.delete',
        type: 'danger',
        click: (data: any) =>
          dispatch(
            showModal(
              <ConfirmModal
                approveButtonText="application.delete"
                mainText="application.doYouWantDeleteInvite"
                cancelButtonText="application.cancel"
                approveAction={() => dispatch(deleteSentInvitations(data.id))}
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
