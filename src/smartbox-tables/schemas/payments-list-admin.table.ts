import { PaymentDocument, PaymentStatus, PaymentType } from 'smartbox-types';
import { FieldType, TableSchema } from 'src/smartbox-tables/typings';

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

export const paymentsListAdminTableSchema: TableSchema = {
  countPerPage: 10,
  fields: [
    {
      name: 'application.tables.id',
      field: 'id',
      type: FieldType.Text,
      sortable: false,
      searchable: false,
      defaultSort: false,
      alias: 'payment',
      mobile: true,
    },
    {
      name: 'application.tables.date',
      field: 'date',
      type: FieldType.Date,
      sortable: true,
      searchable: true,
      defaultSort: true,
      oppositeSortDir: true,
      alias: 'payment',
      mobile: true,
    },
    {
      name: 'application.tables.invoiceEmail',
      field: 'mailToSendInvoice',
      type: FieldType.Email,
      sortable: true,
      searchable: true,
      alias: 'payment',
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
      mobile: true,
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
      mobile: true,
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
      mobile: true,
    },
    {
      name: 'application.tables.invoiceId',
      field: 'invoiceId',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'payment',
      mobile: true,
    },
    {
      name: 'application.tables.invoiceNumber',
      field: 'invoiceNumber',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'payment',
      mobile: true,
    },
    {
      name: 'application.tables.group',
      field: 'boxGroupName',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'boxGroup',
      entityFieldName: 'name',
      mobile: true,
    },
    {
      name: 'application.tables.lockerNumber',
      field: 'boxNumber',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'rent',
      entityFieldName: 'number',
      mobile: true,
    },
    {
      name: 'application.tables.customer',
      field: 'identifier',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'tenant',
      mobile: true,
    },
  ],
};
