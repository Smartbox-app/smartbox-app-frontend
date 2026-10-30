import React from 'react';
import { useDispatch } from 'react-redux';

import { stocksList } from 'smartbox-tables';
import { StockAdminList, UserRole } from 'smartbox-types';
import { showModal } from 'src/actions/modal';
import { Button } from 'src/components/Branded';
import { ApiTable } from 'src/components/Common';
import { DeleteStockModal } from 'src/components/Common/DeleteStockModal';
import { DownloadReportModal } from 'src/components/Common/DownloadReportModal';
import { Section, ButtonsContainer } from 'src/components/Layout';
import { HeaderWithActions, Button as UIButton } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { useDeleteStockMutation } from 'src/mutations';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';

const List = () => {
  const dispatch = useDispatch();
  const { mutate: deleteStock } = useDeleteStockMutation();
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
          approveAction={(stockName) => handleDeleteStock(data, stockName)}
        />,
      ),
    );
  };

  const handleDeleteStock = (data: StockAdminList, stockName: string) => {
    deleteStock({
      stockId: data.id,
      stockName,
      successMessage: getText('deleted'),
    });
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
