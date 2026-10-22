import { FieldType, TableSchema } from '../typings';

const statusFields = [
  {
    name: 'application.tables.newStatus',
    field: 'newStatus',
    mobile: true,
    searchable: true,
    sortable: true,
    defaultSort: false,
    type: FieldType.Text,
  },
  {
    name: 'application.tables.previousStatus',
    field: 'oldStatus',
    mobile: true,
    searchable: true,
    sortable: true,
    defaultSort: false,
    type: FieldType.Text,
  },
  {
    name: 'application.tables.date',
    field: 'date',
    mobile: true,
    searchable: true,
    sortable: true,
    defaultSort: true,
    type: FieldType.Date,
  },
  {
    name: 'application.tables.number',
    field: 'box',
    mobile: true,
    searchable: true,
    sortable: true,
    defaultSort: false,
    type: FieldType.Text,
  },
  {
    name: 'application.tables.rentedFrom',
    field: 'rentFromAt',
    mobile: true,
    searchable: true,
    sortable: true,
    defaultSort: false,
    type: FieldType.Date,
  },
  {
    name: 'application.tables.rentedUntil',
    field: 'rentToAt',
    mobile: true,
    searchable: true,
    sortable: true,
    defaultSort: false,
    type: FieldType.Date,
  },
  {
    name: 'application.tables.renterEmail',
    field: 'tenantEmail',
    mobile: true,
    searchable: true,
    sortable: true,
    defaultSort: false,
    type: FieldType.Email,
  },
];

export const StockStatusTable: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'application.tables.employee',
      field: 'workerName',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.userType',
      field: 'role',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    ...statusFields,
  ],
};

export const WorkerStatusTable: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'application.tables.siteName',
      field: 'stockName',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    ...statusFields,
  ],
};
