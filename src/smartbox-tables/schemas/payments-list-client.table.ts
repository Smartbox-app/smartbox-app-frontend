import { PaymentDocument, PaymentStatus, PaymentType } from 'smartbox-types';
import { FieldType, TableSchema } from '../typings';

const statusToText: {
  [key: string]: string;
} = {
  [PaymentStatus.wait]: 'application.paymentListStatusWait',
  [PaymentStatus.pending]: 'application.paymentListStatusInProgress',
  [PaymentStatus.accepted]: 'application.paymentListStatusSuccess',
  [PaymentStatus.failure]: 'application.paymentListStatusFailure',
};

const typeToText: {
  [key: string]: string;
} = {
  [PaymentType.Extension]: 'application.paymentListTypeExtension',
  [PaymentType.PeriodPayment]: 'application.paymentListTypePeriodPayment',
  [PaymentType.NewRent]: 'application.paymentListTypeNewRent',
  [PaymentType.Unset]: 'application.paymentListTypeUnset',
};

const documentToText: {
  [key: string]: string;
} = {
  [PaymentDocument.Invoice]: 'application.documentInvoice',
  [PaymentDocument.Receipt]: 'application.documentReceipt',
};

export const paymentsListClientTableSchema: TableSchema = {
  countPerPage: 10,
  fields: [
    {
      name: 'application.tables.date',
      field: 'date',
      type: FieldType.Date,
      sortable: true,
      searchable: true,
      defaultSort: true,
      oppositeSortDir: false,
      alias: 'payment',
      entityFieldName: 'date',
      mobile: true,
    },
    {
      name: 'application.tables.invoiceEmail',
      field: 'mailToSendInvoice',
      type: FieldType.Email,
      sortable: true,
      searchable: true,
      alias: 'payment',
      entityFieldName: 'mailToSendInvoice',
      mobile: true,
    },
    {
      name: 'application.tables.status',
      field: 'status',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      searchableValues: statusToText,
      customValue: (row: { status: string }) => statusToText[row.status],
      alias: 'payment',
      mobile: true,
    },
    {
      name: 'application.tables.type',
      field: 'type',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      searchableValues: typeToText,
      customValue: (row: { type: string }) => typeToText[row.type],
      alias: 'payment',
    },
    {
      name: 'application.tables.value',
      field: 'value',
      type: FieldType.Price,
      sortable: true,
      searchable: true,
      alias: 'payment',
      mobile: true,
    },
    {
      name: 'application.tables.method',
      field: 'method',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'payment',
    },
    {
      name: 'application.tables.document',
      field: 'document',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      searchableValues: documentToText,
      customValue: (row: { document: string }) => documentToText[row.document],
      alias: 'payment',
    },
    {
      name: 'application.tables.invoiceId',
      field: 'invoiceId',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'payment',
    },
    {
      name: 'application.tables.invoiceNumber',
      field: 'invoiceNumber',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'payment',
    },
    {
      name: 'application.tables.group',
      field: 'boxGroupName',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'boxGroup',
      entityFieldName: 'name',
    },
    {
      name: 'application.tables.lockerNumber',
      field: 'boxNumber',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'rent',
      entityFieldName: 'number',
    },
  ],
};
