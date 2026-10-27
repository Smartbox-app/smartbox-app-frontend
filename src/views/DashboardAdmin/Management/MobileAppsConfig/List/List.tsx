import React from 'react';
import { useDispatch } from 'react-redux';

import { mobileConfigTableSchema } from 'smartbox-tables';
import { MobileConfigListDetails } from 'smartbox-types';
import { showModal } from 'src/actions/modal';
import { Button } from 'src/components/Branded';
import { ApiTable, ConfirmModal } from 'src/components/Common';
import { Section, ButtonsContainer } from 'src/components/Layout';
import { HeaderWithActions } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useDeleteMobileConfigMutation } from 'src/mutations';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import { Edit } from 'src/views/DashboardAdmin/Management/MobileAppsConfig/Edit';

const List = () => {
  const dispatch = useDispatch();
  const { mutate: deleteMobileConfig } = useDeleteMobileConfigMutation();

  const scheme = new InteractiveTableSchema(mobileConfigTableSchema);
  const { data: user } = useGetMyDetailsQuery();

  scheme.addFieldAtTheEnd({
    name: __('application.actions'),
    field: 'actions',
    mobile: true,
    buttons: [
      {
        name: 'application.delete',
        type: 'danger',
        click: (data: MobileConfigListDetails) => confirmConfigDelete(data),
      },
      {
        name: 'application.edit',
        type: 'primary',
        click: (data: MobileConfigListDetails) => dispatch(showModal(<Edit configId={data.id} />)),
      },
    ],
  });

  const confirmConfigDelete = (data: MobileConfigListDetails) => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText="mobileConfig.deleteConfirmation"
          approveButtonText="application.yes"
          approveAction={() => deleteMobileConfig(data.id)}
        />,
      ),
    );
  };

  return (
    <Section>
      <HeaderWithActions
        actions={
          <ButtonsContainer>
            <Button
              text="mobileConfig.add"
              primary
              to={`/${UserService.getSlugByRole(user!.role)}/management/mobile-config/add`}
            />
          </ButtonsContainer>
        }
      >
        {__('mobileConfig.list')}
      </HeaderWithActions>

      <ApiTable
        scheme={scheme}
        apiEndpointSubUrl="mobile-config"
      />
    </Section>
  );
};

export { List };
