import { FieldType, TableSchema } from 'src/smartbox-tables/typings';

export const discounTable: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'application.tables.siteName',
      field: 'name',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.discountPercent',
      field: 'value',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.expirationDate',
      field: 'expireAt',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: true,
      type: FieldType.Date,
    },
  ],
};
