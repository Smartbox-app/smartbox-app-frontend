import { FieldType, TableSchema } from '../typings';

const statusToText: {
  [key: string]: string;
} = {
  Aktywny: 'application.tables.statusActive',
  Zablokowany: 'application.tables.statusBlocked',
};

export const tenantsList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'application.tables.name',
      field: 'name',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.email',
      field: 'email',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Email,
    },
    {
      name: 'application.tables.firstName',
      field: 'firstName',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.lastName',
      field: 'lastName',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.phone',
      field: 'phone',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Tel,
    },
    {
      name: 'application.tables.status',
      field: 'status',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: true,
      type: FieldType.Text,
      searchableValues: statusToText,
    },
  ],
};
