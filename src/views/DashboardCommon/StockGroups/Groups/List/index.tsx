import React from 'react';
import { useDispatch } from 'react-redux';

import { stockGroupsList } from 'smartbox-tables';
import { StockGroupData, UserRole } from 'smartbox-types';
import { refreshApiTableData } from 'src/actions/api-table';
import { showModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { Button } from 'src/components/Branded';
import { ApiTable, ConfirmModal } from 'src/components/Common';
import { ButtonsContainer, Section } from 'src/components/Layout';
import { HeaderWithActions } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { useGetMyDetailsQuery } from 'src/queries';
import ApiService from 'src/services/api-service';
import UserService from 'src/services/user-service';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';

const GroupsList = () => {
  const dispatch = useDispatch();
  const { getText } = useTenantNaming();

  const scheme = new InteractiveTableSchema(stockGroupsList);
  const { data: user } = useGetMyDetailsQuery();

  const hasFullAccess = [UserRole.admin, UserRole.client].includes(user!.role);

  scheme.addFieldAtTheEnd({
    name: __('application.actions'),
    field: 'actions',
    mobile: true,
    buttons: [
      hasFullAccess
        ? {
            name: 'application.delete',
            type: 'danger',
            click: (data: StockGroupData) => confirmStockGroupDelete(data),
          }
        : null,
      {
        name: 'application.manage',
        type: 'primary',
        click: (data: StockGroupData) =>
          history.push(
            `/${UserService.getSlugByRole(user!.role)}/locations/groups/${data.id}`,
          ),
      },
    ],
  });

  const confirmStockGroupDelete = (data: StockGroupData) => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText={getText('confirm_group_delete')}
          approveButtonText="application.yes"
          approveAction={() => deleteStockGroup(data)}
        />,
      ),
    );
  };

  const deleteStockGroup = async (data: StockGroupData) => {
    await ApiService.callFetch('DELETE', `stock-group/${data.id}`, () => {
      dispatch(successNotification(getText('group_deleted')));
      dispatch(refreshApiTableData());
    });
  };

  return (
    <Section>
      <HeaderWithActions
        actions={
          hasFullAccess && (
            <ButtonsContainer>
              <Button
                text={getText('add_group')}
                primary
                to={`/${UserService.getSlugByRole(user!.role)}/locations/groups/add`}
              />
            </ButtonsContainer>
          )
        }
      >
        {getText('group_list')}
      </HeaderWithActions>

      <ApiTable scheme={scheme} apiEndpointSubUrl="stock-group/admin-list" />
    </Section>
  );
};

export { GroupsList };
