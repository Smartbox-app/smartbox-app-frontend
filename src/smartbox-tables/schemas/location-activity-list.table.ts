import { FieldType, TableSchema } from '../typings';

const statusToText: Record<string, string> = {
  inside: 'application.tables.inside',
  outside: 'application.tables.outside',
};

export const locationActivityList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'application.tables.user',
      field: 'userName',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
      customValue: (row: {
        firstName?: string;
        lastName?: string;
        email?: string;
      }) =>
        [row.firstName, row.lastName].filter(Boolean).join(' ') || row.email,
    },
    {
      name: 'application.tables.email',
      field: 'email',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Email,
    },
    {
      name: 'application.tables.alarm',
      field: 'alarm',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.location',
      field: 'location',
      mobile: false,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.status',
      field: 'status',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
      customValue: (row: { status: string }) =>
        statusToText[row.status] ?? row.status,
    },
    {
      name: 'application.tables.lastUpdate',
      field: 'statusUpdate',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Date,
    },
  ],
};
