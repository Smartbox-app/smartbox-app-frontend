import React from 'react';
import { useDispatch } from 'react-redux';
import { stockGroupsList } from 'smartbox-tables';
import { StockGroupData, UserRole } from 'smartbox-types';
import { showModal } from '../../../../../actions/modal';
import { successNotification } from '../../../../../actions/notifications';
import ApiService from '../../../../../services/api-service';
import { ApiTable, ConfirmModal } from '../../../../../components/Common';
import { __ } from '../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../utils/table-schema-utils';
import { refreshApiTableData } from '../../../../../actions/api-table';
import UserService from '../../../../../services/user-service';
import { history } from 'src/history';
import { ButtonsContainer, Section } from '../../../../../components/Layout';
import { Button } from '../../../../../components/Branded';
import { useGetMyDetailsQuery } from 'src/queries';
import { HeaderWithActions } from 'src/components/ui';
import { useTenantNaming } from 'src/hooks/useTenantNaming';

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
