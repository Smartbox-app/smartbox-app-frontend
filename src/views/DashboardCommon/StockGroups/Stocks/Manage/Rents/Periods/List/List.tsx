import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { FieldType, periodsForRentList, TableSchema } from 'smartbox-tables';
import { FakturowniaInvoiceUserRes } from 'smartbox-types';
import { ApiTable, ConfirmModal } from 'src/components/Common';
import ApiService from 'src/services/api-service';
import { showModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { refreshApiTableData } from 'src/actions/api-table';
import { __ } from 'src/helpers/i18n';
import { Section, Button as UIButton, Header } from 'src/components/ui';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { ButtonsContainer } from 'src/components/Layout';
import { useRentDetailsQuery } from 'src/queries';
import { RentSummary } from '../../../../../../../../components/Common/RentSummary/RentSummary';

type PeriodRow = {
  id: string;
  invoiceId: string;
  paid: boolean;
};

const isInvoiceIssued = (invoiceId: string | null | undefined) =>
  !!invoiceId && !['error', 'pending'].includes(invoiceId);

const List = () => {
  const dispatch = useDispatch();
  const { rentId } = useParams<{ stockId: string; rentId: string }>();
  const { data: rent } = useRentDetailsQuery(rentId);

  const handleViewDocument = useCallback(
    async (periodId: string) => {
      const payload = await ApiService.callFetch<FakturowniaInvoiceUserRes>(
        'GET',
        `rent/${rentId}/periods/${periodId}/document`,
      );

      if (!payload || !payload.view_url) return;

      if (Capacitor.isNativePlatform()) {
        await Browser.open({ url: payload.view_url });
      } else {
        window.open(payload.view_url, '_blank', 'noopener,noreferrer');
      }
    },
    [rentId],
  );

  const markPeriodAsPaid = async (periodId: string) => {
    await ApiService.callFetch(
      'PATCH',
      `rent/${rentId}/periods/${periodId}/paid`,
      () => {
        dispatch(successNotification('application.markPeriodAsPaidSuccess'));
        dispatch(refreshApiTableData());
      },
    );
  };

  const confirmMarkPeriodAsPaid = (periodId: string) => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText="application.markPeriodAsPaidConfirm"
          approveButtonText="application.yes"
          approveAction={() => markPeriodAsPaid(periodId)}
        />,
      ),
    );
  };

  const scheme: TableSchema = useMemo(
    () =>
      new InteractiveTableSchema(periodsForRentList).addFieldAtTheEnd({
        name: __('application.actions'),
        field: 'actions',
        type: FieldType.Custom,
        sortable: false,
        searchable: false,
        mobile: true,
        customRender: (_value, _field, row: PeriodRow) => {
          const issued = isInvoiceIssued(row.invoiceId);
          const canViewDocument = issued;
          const canMarkAsPaid = issued && !row.paid;

          if (!issued && !canMarkAsPaid) {
            return '-';
          }

          return (
            <ButtonsContainer noWrap>
              {canViewDocument ? (
                <UIButton
                  variant="secondary"
                  type="button"
                  text="application.viewDocument"
                  onClick={() => handleViewDocument(row.id)}
                />
              ) : null}
              {canMarkAsPaid ? (
                <UIButton
                  variant="success"
                  type="button"
                  text="application.markPeriodAsPaid"
                  onClick={() => confirmMarkPeriodAsPaid(row.id)}
                />
              ) : null}
            </ButtonsContainer>
          );
        },
      }),
    [handleViewDocument, confirmMarkPeriodAsPaid],
  );

  if (!rentId) return null;

  return (
    <Section>
      <Header variant="h2">{__('application.rentPeriods')}</Header>
      {rent ? <RentSummary rent={rent} /> : null}
      <ApiTable scheme={scheme} apiEndpointSubUrl={`rent/${rentId}/periods`} />
    </Section>
  );
};

export { List };
