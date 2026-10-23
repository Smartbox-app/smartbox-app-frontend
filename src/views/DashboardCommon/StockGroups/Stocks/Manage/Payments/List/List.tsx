import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import {
  FieldType,
  paymentsListAdminTableSchema,
  paymentsListClientTableSchema,
  TableSchema,
} from 'smartbox-tables';
import {
  PaymentAdminListItem,
  PaymentClientListItem,
  UserRole,
  FakturowniaInvoiceUserRes,
  PaymentStatus,
} from 'smartbox-types';
import { ApiTable, ConfirmModal } from 'src/components/Common';
import ApiService from 'src/services/api-service';
import { showModal } from 'src/actions/modal';
import { __ } from 'src/helpers/i18n';
import { useGetMyDetailsQuery } from 'src/queries';
import { useForcePaymentMutation } from 'src/mutations';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import { Section, Button as UIButton } from 'src/components/ui';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { ButtonsContainer } from 'src/components/Layout';

const isInvoiceIssued = (invoiceId: string | null | undefined) =>
  !!invoiceId && !['error', 'pending'].includes(invoiceId);

const isPaymentPending = (
  row: PaymentAdminListItem | PaymentClientListItem,
) => {
  if (row.rentId == null || row.rentId === '') return false;
  const s = row.status as PaymentStatus | string | number;
  return Number(s) === PaymentStatus.wait;
};

export const List = () => {
  const dispatch = useDispatch();
  const { stockId } = useParams<{ stockId: string }>();
  const { data: user } = useGetMyDetailsQuery();
  const { mutate: forcePayment } = useForcePaymentMutation();

  const handleViewDocument = useCallback(async (paymentId: string) => {
    const payload = await ApiService.callFetch<FakturowniaInvoiceUserRes>(
      'GET',
      `payment/document/${paymentId}`,
    );

    if (!payload || !payload.view_url) return;

    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url: payload.view_url });
    } else {
      window.open(payload.view_url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const confirmForcePaymentAcceptance = (rentId: string, paymentId: string) => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText="application.forcePaymentAcceptanceConfirm"
          secondaryText="application.forcePaymentStatusDisclaimer"
          approveButtonText="application.yes"
          approveAction={() =>
            forcePayment({ rentId, paymentId, action: 'accept' })
          }
        />,
      ),
    );
  };

  const confirmForcePaymentCancellation = (
    rentId: string,
    paymentId: string,
  ) => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText="application.forcePaymentCancellationConfirm"
          secondaryText="application.forcePaymentStatusDisclaimer"
          approveButtonText="application.yes"
          approveAction={() =>
            forcePayment({ rentId, paymentId, action: 'cancel' })
          }
        />,
      ),
    );
  };

  const scheme = useMemo((): TableSchema | null => {
    if (!user) return null;

    const baseScheme: TableSchema =
      user.role === UserRole.admin
        ? paymentsListAdminTableSchema
        : paymentsListClientTableSchema;

    const apiScheme = new InteractiveTableSchema(baseScheme).addFieldAtTheEnd({
      name: __('application.actions'),
      field: 'actions',
      type: FieldType.Custom,
      sortable: false,
      searchable: false,
      mobile: true,
      customRender: (
        _value,
        _field,
        row: PaymentAdminListItem | PaymentClientListItem,
      ) => {
        const canView = isInvoiceIssued(row.invoiceId);
        const canForce = isPaymentPending(row);

        if (!canView && !canForce) {
          return '-';
        }

        return (
          <ButtonsContainer noWrap>
            {canView ? (
              <UIButton
                variant="secondary"
                type="button"
                text="application.viewDocument"
                onClick={() => handleViewDocument(row.id)}
              />
            ) : null}
            {canForce ? (
              <>
                <UIButton
                  variant="primary"
                  type="button"
                  text="application.forcePaymentAcceptance"
                  onClick={() =>
                    confirmForcePaymentAcceptance(row.rentId!, row.id)
                  }
                />
                <UIButton
                  variant="error"
                  type="button"
                  text="application.forcePaymentCancellation"
                  onClick={() =>
                    confirmForcePaymentCancellation(row.rentId!, row.id)
                  }
                />
              </>
            ) : null}
          </ButtonsContainer>
        );
      },
    });

    return apiScheme;
  }, [
    user,
    handleViewDocument,
    confirmForcePaymentAcceptance,
    confirmForcePaymentCancellation,
  ]);

  if (!user || !scheme) return null;

  const apiEndpointSubUrl = `payment/list/${stockId}`;

  return (
    <Section>
      <ApiTable scheme={scheme} apiEndpointSubUrl={apiEndpointSubUrl} />
    </Section>
  );
};
