import { FieldType, TableSchema } from '../typings';

export const apiAccessTableSchema: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'Nazwa',
      field: 'name',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: true,
      type: FieldType.Text,
    },
    {
      name: 'Franczyzobiorca',
      field: 'tenant',
      mobile: true,
      searchable: false,
      sortable: false,
      type: FieldType.Text,
    },
    {
      name: 'Uprawnienia',
      field: 'scopes',
      searchable: false,
      sortable: false,
      type: FieldType.Text,
    },
    {
      name: 'Aktywny',
      field: 'isActive',
      mobile: true,
      searchable: true,
      sortable: true,
      type: FieldType.Boolean,
    },
    {
      name: 'Wygasa',
      field: 'expiresAt',
      searchable: false,
      sortable: true,
      type: FieldType.Date,
    },
    {
      name: 'Utworzono',
      field: 'createdAt',
      searchable: false,
      sortable: true,
      type: FieldType.Date,
    },
  ],
};
