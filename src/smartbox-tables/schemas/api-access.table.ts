import { FieldType, TableSchema } from '../typings';

export const apiAccessTableSchema: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'application.tables.name',
      field: 'name',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: true,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.franchisee',
      field: 'tenant',
      mobile: true,
      searchable: false,
      sortable: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.permissions',
      field: 'scopes',
      searchable: false,
      sortable: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.active',
      field: 'isActive',
      mobile: true,
      searchable: true,
      sortable: true,
      type: FieldType.Boolean,
    },
    {
      name: 'application.tables.expires',
      field: 'expiresAt',
      searchable: false,
      sortable: true,
      type: FieldType.Date,
    },
    {
      name: 'application.tables.created',
      field: 'createdAt',
      searchable: false,
      sortable: true,
      type: FieldType.Date,
    },
  ],
};
