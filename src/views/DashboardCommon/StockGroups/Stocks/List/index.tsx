import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { stocksList } from 'smartbox-tables';
import { showModal } from '../../../../../actions/modal';
import { successNotification } from '../../../../../actions/notifications';
import ApiService from '../../../../../services/api-service';
import { StockAdminList, UserRole } from 'smartbox-types';
import { ApiTable, ConfirmModal } from '../../../../../components/Common';
import { Button } from '../../../../../components/Branded';
import {
  Section,
  PageHeader,
  ButtonsContainer,
} from '../../../../../components/Layout';
import { __ } from '../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../utils/table-schema-utils';
import { refreshApiTableData } from '../../../../../actions/api-table';
import { history } from '../../../../../App';
import UserService from '../../../../../services/user-service';
import { ApplicationState } from '../../../../../reducers';
import { useGetMyDetailsQuery } from 'src/queries';
import { HeaderWithActions } from 'src/components/ui';

const List = () => {
  const dispatch = useDispatch();
  const scheme = new InteractiveTableSchema(stocksList);
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
            click: (data: StockAdminList) => confirmStockDelete(data),
          }
        : null,
      {
        name: 'application.manage',
        type: 'primary',
        click: (data: StockAdminList) =>
          history.push(
            `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${data.id}`,
          ),
      },
    ],
  });

  const confirmStockDelete = (data: StockAdminList) => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText="application.confirmStockDelete"
          approveButtonText="application.yes"
          approveAction={() => deleteStock(data)}
        />,
      ),
    );
  };

  const deleteStock = async (data: StockAdminList) => {
    await ApiService.callFetch('DELETE', `stock/${data.id}`, () => {
      dispatch(successNotification('application.stockDeleted'));
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
                text="application.addStock"
                primary
                to={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/add`}
              />
            </ButtonsContainer>
          ) : null
        }
      >
        {__('application.stocksList')}
      </HeaderWithActions>

      <ApiTable scheme={scheme} apiEndpointSubUrl={`stock/admin-list`} />
    </Section>
  );
};

export { List };
