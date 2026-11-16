import { FieldType, TableSchema } from 'src/smartbox-tables/typings';

const typeToText: { [key: string]: string } = {
  invoice_issue: 'application.alertTypes.invoice_issue',
  payment_verify: 'application.alertTypes.payment_verify',
};

const statusToText: { [key: string]: string } = {
  open: 'application.alertStatus.open',
  read: 'application.alertStatus.read',
};

export const systemAlertListTable: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'application.tables.type',
      field: 'type',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
      customValue: (row: { type?: string }) =>
        (row.type && typeToText[row.type]) || row.type || '',
      searchableValues: typeToText,
    },
    {
      name: 'application.tables.message',
      field: 'message',
      mobile: true,
      searchable: true,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.status',
      field: 'status',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
      customValue: (row: { status?: string }) =>
        (row.status && statusToText[row.status]) || row.status || '',
      searchableValues: statusToText,
    },
    {
      name: 'application.tables.created',
      field: 'createdAt',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: true,
      type: FieldType.Date,
    },
    {
      name: 'application.tables.updated',
      field: 'updatedAt',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Date,
    },
  ],
};
