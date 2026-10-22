import { FieldType, TableSchema } from '../typings';

export const companyListAdmin: TableSchema = {
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
      field: 'identifier',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
      alias: 'tenant',
    },
  ],
};
