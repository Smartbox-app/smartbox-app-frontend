import React from 'react';
import { useDispatch } from 'react-redux';
import { companyList, companyListAdmin, FieldType } from 'smartbox-tables';
import { CompanyListAdminRes, CompanyListRes, UserRole } from 'smartbox-types';
import { history } from 'src/history';
import { showModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { refreshApiTableData } from 'src/actions/api-table';
import { Button } from 'src/components/Branded';
import { ApiTable, ConfirmModal, InvoiceStatus } from 'src/components/Common';
import { ButtonsContainer } from 'src/components/Layout';
import { HeaderWithActions, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useGetMyDetailsQuery } from 'src/queries';
import ApiService from 'src/services/api-service';
import UserService from 'src/services/user-service';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import { useCanCreateCompany } from '../useCanCreateCompany';

export const List = () => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();
  const { canCreate } = useCanCreateCompany();

  if (!user) return null;

  const canDelete = true;
  const isAdmin = user.role === UserRole.admin;
  const slug = UserService.getSlugByRole(user.role);
  const basePath = `/${slug}/management/settlements`;

  const deleteCompany = async (companyId: string) => {
    await ApiService.callFetch('DELETE', `company/${companyId}`, () => {
      dispatch(successNotification('application.companyDeleted'));
      dispatch(refreshApiTableData());
    });
  };

  const confirmCompanyDelete = (data: CompanyListRes | CompanyListAdminRes) => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText="application.confirmCompanyDelete"
          approveButtonText="application.delete"
          approveAction={() => deleteCompany(data.id)}
        />,
      ),
    );
  };

  const scheme = new InteractiveTableSchema(
    isAdmin ? companyListAdmin : companyList,
  )
    .addFieldAfter('name', {
      name: __('application.invoiceStatus'),
      field: 'invoiceStatus',
      mobile: true,
      type: FieldType.Custom,
      customRender: (_value, _field, row: CompanyListRes) =>
        row.tenantId ? <InvoiceStatus tenantId={row.tenantId} /> : null,
    })
    .addFieldAtTheEnd({
    name: __('application.actions'),
    field: 'actions',
    mobile: true,
    buttons: [
      {
        name: 'application.edit',
        type: 'primary',
        click: (data: CompanyListRes) =>
          history.push(`${basePath}/${data.id}`),
      },
      ...(canDelete
        ? [
            {
              name: 'application.delete',
              type: 'danger' as const,
              click: (data: CompanyListRes) => confirmCompanyDelete(data),
            },
          ]
        : []),
    ],
  });

  return (
    <Section>
      <HeaderWithActions
        actions={
          canCreate ? (
            <ButtonsContainer>
              <Button
                text="application.addCompany"
                primary
                to={`${basePath}/add`}
              />
            </ButtonsContainer>
          ) : null
        }
      >
        {__('application.companyList')}
      </HeaderWithActions>

      <ApiTable scheme={scheme} apiEndpointSubUrl="company/list" />
    </Section>
  );
};
