import React, { useCallback, useMemo } from 'react';
import {
  FieldType,
  paymentsListAdminTableSchema,
  paymentsListClientTableSchema,
  TableSchema,
} from 'smartbox-tables';

import { ApiTable } from '../../../../components/Common';
import { Section } from '../../../../components/Layout';
import { Button as UIButton, Header } from 'src/components/ui';
import { __ } from '../../../../helpers/i18n';
import { useGetMyDetailsQuery } from 'src/queries';
import {
  PaymentAdminListItem,
  PaymentClientListItem,
  UserRole,
  FakturowniaInvoiceUserRes,
} from 'smartbox-types';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import ApiService from 'src/services/api-service';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

export const List = () => {
  const { data: user } = useGetMyDetailsQuery();

  const handleViewDocument = useCallback(async (invoiceId: string) => {
    const payload = await ApiService.callFetch<FakturowniaInvoiceUserRes>(
      'GET',
      `payment/document/${invoiceId}`,
    );

    if (!payload || !payload.view_url) return;

    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url: payload.view_url });
    } else {
      window.open(payload.view_url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const scheme: TableSchema = useMemo(() => {
    const baseScheme: TableSchema =
      user?.role === UserRole.admin
        ? paymentsListAdminTableSchema
        : paymentsListClientTableSchema;

    return new InteractiveTableSchema(baseScheme).addFieldAtTheEnd({
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
        if (!row.invoiceId || ['error', 'pending'].includes(row.invoiceId))
          return '-';

        return (
          <UIButton
            variant="secondary"
            text={__('application.viewDocument')}
            onClick={() => handleViewDocument(row.id)}
          />
        );
      },
    });
  }, [user, handleViewDocument]);

  return (
    <Section>
      <Header variant="h2">{__('application.payments')}</Header>
      <ApiTable
        scheme={scheme}
        apiEndpointSubUrl="payment/list"
      />
    </Section>
  );
};
