import { PaymentDocument, PaymentStatus, PaymentType } from 'smartbox-types';
import { FieldType, TableSchema } from '../typings';

const statusToText: {
  [key: string]: string;
} = {
  [PaymentStatus.wait]: 'Oczekuje',
  [PaymentStatus.inProgress]: 'W trakcie',
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

export const paymentsListAdminTableSchema: TableSchema = {
  countPerPage: 10,
  fields: [
    {
      name: 'ID',
      field: 'id',
      type: FieldType.Text,
      sortable: false,
      searchable: false,
      defaultSort: false,
      alias: 'payment',
      mobile: true
    },
    {
      name: 'Data',
      field: 'date',
      type: FieldType.Date,
      sortable: true,
      searchable: true,
      defaultSort: true,
      oppositeSortDir: true,
      alias: 'payment',
      mobile: true
    },
    {
      name: 'E-mail do faktury',
      field: 'mailToSendInvoice',
      type: FieldType.Email,
      sortable: true,
      searchable: true,
      alias: 'payment',
      mobile: true
    },
    {
      name: 'Status',
      field: 'status',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      searchableValues: statusToText,
      customValue: (row) => statusToText[row.status],
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
      customValue: (row) => typeToText[row.type],
      alias: 'payment',
      mobile: true
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
      mobile: true
    },
    {
      name: 'Dokument',
      field: 'document',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      searchableValues: documentToText,
      customValue: (row) => documentToText[row.document],
      alias: 'payment',
      mobile: true
    },
    {
      name: 'ID faktury',
      field: 'invoiceId',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'payment',
      mobile: true
    },
    {
      name: 'Grupa',
      field: 'boxGroupName',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'boxGroup',
      entityFieldName: 'name',
      mobile: true
    },
    {
      name: 'Nr skrytki',
      field: 'boxNumber',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'rent',
      entityFieldName: 'number',
      mobile: true
    },
    {
      name: 'Klient',
      field: 'identifier',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      alias: 'tenant',
      mobile: true
      },
  ],
};
