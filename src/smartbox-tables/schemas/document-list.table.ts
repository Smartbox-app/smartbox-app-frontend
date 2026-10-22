import { FieldType, TableSchema } from '../typings';

export const documentList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'application.tables.id',
      field: 'id',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
      alias: 'document',
    },
    {
      name: 'application.tables.modified',
      field: 'updatedAt',
      mobile: true,
      searchable: false,
      sortable: true,
      defaultSort: true,
      type: FieldType.Date,
      alias: 'document',
    },
    {
      name: 'application.tables.type',
      field: 'type',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
      alias: 'document',
    },
    {
      name: 'application.tables.customer',
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
