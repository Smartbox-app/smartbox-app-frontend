import { FieldType, TableSchema } from '../typings';

const statusToText: Record<string, string> = {
  inside: 'Wewnątrz',
  outside: 'Na zewnątrz',
};

export const locationActivityList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'Użytkownik',
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
      name: 'E-mail',
      field: 'email',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Email,
    },
    {
      name: 'Alarm',
      field: 'alarm',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'Lokalizacja',
      field: 'location',
      mobile: false,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'Status',
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
      name: 'Ostatnia aktualizacja',
      field: 'statusUpdate',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Date,
    },
  ],
};
