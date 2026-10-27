import React from 'react';
import { useDispatch } from 'react-redux';

import { attachmentList, attachmentListForAdmin } from 'smartbox-tables';
import {
  AttachmentListAdminRes,
  AttachmentListRes,
  UserRole,
} from 'smartbox-types';
import { showModal } from 'src/actions/modal';
import { Button } from 'src/components/Branded';
import { ApiTable, ConfirmModal } from 'src/components/Common';
import { Section, ButtonsContainer } from 'src/components/Layout';
import { HeaderWithActions } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useDeleteAttachmentMutation } from 'src/mutations';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import { Edit } from 'src/views/DashboardCommon/AttachmentManagement/Edit';

const List = () => {
  const dispatch = useDispatch();
  const { mutate: deleteAttachment } = useDeleteAttachmentMutation();
  const { data: user } = useGetMyDetailsQuery();
  const scheme = new InteractiveTableSchema(
    user?.role === UserRole.admin ? attachmentListForAdmin : attachmentList,
  );
  const hasAdminAccess = [UserRole.admin].includes(user!.role);
  const hasFullAccess = [UserRole.admin, UserRole.client].includes(user!.role);

  scheme
    .addFieldAtTheEnd({
      name: __('application.actions'),
      field: 'actions',
      mobile: true,
      buttons: [
        hasAdminAccess
          ? {
              name: 'application.delete',
              type: 'danger',
              click: (data: AttachmentListAdminRes) =>
                confirmAttachmentDelete(data),
            }
          : null,
        {
          name: 'application.edit',
          type: 'primary',
          click: (data: AttachmentListRes | AttachmentListAdminRes) =>
            dispatch(showModal(<Edit id={data.id} />)),
        },
      ],
    })
    .removeFields('id');

  const confirmAttachmentDelete = (
    data: AttachmentListRes | AttachmentListAdminRes,
  ) => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText={__('application.phrases.deleteAttachment', {
            name: data.name,
          })}
          approveButtonText="application.yes"
          approveAction={() => deleteAttachment(data.id)}
        />,
      ),
    );
  };

  return (
    <Section>
      <HeaderWithActions
        actions={
          hasFullAccess ? (
            <ButtonsContainer>
              <Button
                text="application.addAttachment"
                primary
                to={`/${UserService.getSlugByRole(user!.role)}/management/attachments/add`}
              />
            </ButtonsContainer>
          ) : null
        }
      >
        {__('application.attachmentList')}
      </HeaderWithActions>

      <ApiTable scheme={scheme} apiEndpointSubUrl="attachment" />
    </Section>
  );
};

export { List };
