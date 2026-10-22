import React from 'react';
import { useDispatch } from 'react-redux';
import { stocksList } from 'smartbox-tables';
import { showModal } from '../../../../../actions/modal';
import { successNotification } from '../../../../../actions/notifications';
import ApiService from '../../../../../services/api-service';
import { StockAdminList, UserRole } from 'smartbox-types';
import { ApiTable } from '../../../../../components/Common';
import { Button } from '../../../../../components/Branded';
import { Section, ButtonsContainer } from '../../../../../components/Layout';
import { __ } from '../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../utils/table-schema-utils';
import { refreshApiTableData } from '../../../../../actions/api-table';
import { history } from 'src/history';
import UserService from '../../../../../services/user-service';
import { useGetMyDetailsQuery } from 'src/queries';
import { HeaderWithActions, Button as UIButton } from 'src/components/ui';
import { DeleteStockModal } from 'src/components/Common/DeleteStockModal';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { DownloadReportModal } from 'src/components/Common/DownloadReportModal';

const List = () => {
  const dispatch = useDispatch();
  const { getText } = useTenantNaming();
  const scheme = new InteractiveTableSchema(stocksList);
  const { data: user } = useGetMyDetailsQuery();

  const hasAdminAccess = [UserRole.admin].includes(user!.role);
  const hasFullAccess = [UserRole.admin, UserRole.client].includes(user!.role);

  scheme.removeFields('id');

  const handleReportDownload = () => {
    dispatch(showModal(<DownloadReportModal reportType="rent" />));
  };

  const handlePaymentsReportDownload = () => {
    dispatch(showModal(<DownloadReportModal reportType="payment" />));
  };

  scheme.addFieldAtTheEnd({
    name: __('application.actions'),
    field: 'actions',
    mobile: true,
    buttons: [
      hasAdminAccess
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
        <DeleteStockModal
          mainText={getText('confirm_delete', {
            name: data.name,
            address: data.address,
          })}
          approveButtonText="application.yes"
          approveAction={(stockName) => deleteStock(data, stockName)}
        />,
      ),
    );
  };

  const deleteStock = async (data: StockAdminList, stockName: string) => {
    await ApiService.callFetch(
      'DELETE',
      `stock/${data.id}/${stockName}`,
      () => {
        dispatch(successNotification(getText('deleted')));
        dispatch(refreshApiTableData());
      },
    );
  };

  return (
    <Section>
      <HeaderWithActions
        actions={
          hasFullAccess ? (
            <ButtonsContainer>
              <Button
                text={getText('add')}
                primary
                to={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/add`}
              />
              <UIButton
                variant="secondary"
                text={__('application.downloadReport')}
                onClick={handleReportDownload}
              />
              <UIButton
                variant="secondary"
                text={__('application.downloadPaymentsReport')}
                onClick={handlePaymentsReportDownload}
              />
            </ButtonsContainer>
          ) : null
        }
      >
        {getText('list')}
      </HeaderWithActions>

      <ApiTable scheme={scheme} apiEndpointSubUrl="stock/admin-list" />
    </Section>
  );
};

export { List };
