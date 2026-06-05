import React from 'react';
import { useDispatch } from 'react-redux';
import { showModal } from '../../../../actions/modal';
import { successNotification } from '../../../../actions/notifications';
import ApiService from '../../../../services/api-service';
import { AttachmentListAdminRes, AttachmentListRes, UserRole } from 'smartbox-types';
import { ApiTable, ConfirmModal } from '../../../../components/Common';
import { Button } from '../../../../components/Branded';
import {
  Section,
  ButtonsContainer,
} from '../../../../components/Layout';
import { __ } from '../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../utils/table-schema-utils';
import { refreshApiTableData } from '../../../../actions/api-table';
import UserService from '../../../../services/user-service';
import { useGetMyDetailsQuery } from 'src/queries';
import { HeaderWithActions } from 'src/components/ui';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { useTenant } from 'src/hooks/useTenant';
import { attachmentList, attachmentListForAdmin } from 'smartbox-tables';
import { Edit } from '../Edit';

const List = () => {
  const dispatch = useDispatch();
  const { getText } = useTenantNaming();
  const { tenant } = useTenant();

  const { data: user } = useGetMyDetailsQuery();
  const scheme = new InteractiveTableSchema(user?.role === UserRole.admin ? attachmentListForAdmin : attachmentList);
  const hasAdminAccess = [UserRole.admin].includes(user!.role);
  const hasFullAccess = [UserRole.admin, UserRole.client].includes(user!.role);

  scheme.addFieldAtTheEnd({
    name: __('application.actions'),
    field: 'actions',
    mobile: true,
    buttons: [
      hasAdminAccess
        ? {
            name: 'application.delete',
            type: 'danger',
            click: (data: AttachmentListAdminRes) => confirmAttachmentDelete(data),
          }
        : null,
      {
        name: 'application.edit',
        type: 'primary',
        click: (data: AttachmentListRes | AttachmentListAdminRes) =>
          dispatch(showModal(<Edit id={data.id} />))
      },
    ],
  }).removeFields('id');

  const confirmAttachmentDelete = (data: AttachmentListRes | AttachmentListAdminRes) => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText={`Zamierzasz usunąć załącznik ${data.name}, czy na pewno chcesz to zrobić?`}
          approveButtonText="application.yes"
          approveAction={() => deleteAttachment(data)}
        />,
      ),
    );
  };

  const deleteAttachment = async (data: AttachmentListRes | AttachmentListAdminRes) => {
    await ApiService.callFetch('DELETE', `attachment/${data.id}`, () => {
      dispatch(successNotification('application.attachmentDeleted'));
      dispatch(refreshApiTableData());
    });
  };

  return (
    <Section>
      <HeaderWithActions
        actions={
          hasFullAccess ? (
            <ButtonsContainer>
              <Button
                text='application.addAttachment'
                primary
                to={`/${UserService.getSlugByRole(user!.role)}/management/attachments/add`}
              />
            </ButtonsContainer>
          ) : null
        }
      >
        {__('application.attachmentList')}
      </HeaderWithActions>

      <ApiTable
        scheme={scheme}
        apiEndpointSubUrl="attachment"
      />
    </Section>
  );
};

export { List };
