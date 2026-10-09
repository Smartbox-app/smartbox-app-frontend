import { PaymentDocument, PaymentStatus, PaymentType } from 'smartbox-types';
import { FieldType, TableSchema } from '../typings';

const statusToText: {
  [key: string]: string;
} = {
  [PaymentStatus.wait]: 'Oczekuje',
  [PaymentStatus.pending]: 'W trakcie',
  [PaymentStatus.accepted]: 'Sukces',
  [PaymentStatus.failure]: 'Błąd',
};

const typeToText: {
  [key: string]: string;
} = {
  [PaymentType.Extension]: 'Przedłużenie',
  [PaymentType.PeriodPayment]: 'Płatność za okres',
  [PaymentType.NewRent]: 'Nowy wynajem',
  [PaymentType.Unset]: 'Nieustawiony',
};

const documentToText: {
  [key: string]: string;
} = {
  [PaymentDocument.Invoice]: 'Faktura',
  [PaymentDocument.Receipt]: 'Paragon',
};

export const paymentsListClientTableSchema: TableSchema = {
  countPerPage: 10,
  fields: [
    {
      name: 'Data',
      field: 'date',
      type: FieldType.Date,
      sortable: true,
      searchable: true,
      defaultSort: true,
      oppositeSortDir: false,
      alias: 'payment',
      entityFieldName: 'date',
      mobile: true
    },
    {
      name: 'E-mail do faktury',
      field: 'mailToSendInvoice',
      type: FieldType.Email,
      sortable: true,
      searchable: true,
      alias: 'payment',
      entityFieldName: 'mailToSendInvoice',
      mobile: true
    },
    {
      name: 'Status',
      field: 'status',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      searchableValues: statusToText,
      customValue: (row: { status: string }) => statusToText[row.status],
      alias: 'payment',
      mobile: true
    },
    {
      name: 'Typ',
      field: 'type',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      searchableValues: typeToText,
      customValue: (row: { type: string }) => typeToText[row.type],
      alias: 'payment',
    },
    {
      name: 'Wartość',
      field: 'value',
      type: FieldType.Price,
      sortable: true,
      searchable: true,
      alias: 'payment',
      mobile: true
    },
    {
      name: 'Metoda',
      field: 'method',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'payment',
    },
    {
      name: 'Dokument',
      field: 'document',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      searchableValues: documentToText,
      customValue: (row: { document: string }) => documentToText[row.document],
      alias: 'payment',
    },
    {
      name: 'ID faktury',
      field: 'invoiceId',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'payment',
    },
    {
      name: 'Nr faktury',
      field: 'invoiceNumber',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'payment',
    },
    {
      name: 'Grupa',
      field: 'boxGroupName',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'boxGroup',
      entityFieldName: 'name',
    },
    {
      name: 'Nr skrytki',
      field: 'boxNumber',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'rent',
      entityFieldName: 'number',
    },
  ],
};

