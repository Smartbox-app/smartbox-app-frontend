import { FieldType, TableSchema } from '../typings';

export const documentListAdmin: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'ID',
      field: 'id',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
      alias: 'document',
    },
    {
      name: 'Data modyfikacji',
      field: 'updatedAt',
      mobile: true,
      searchable: false,
      sortable: true,
      defaultSort: true,
      type: FieldType.Date,
      alias: 'document',
    },
    {
      name: 'Typ',
      field: 'type',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
      alias: 'document',
    },
    {
      name: 'Klient',
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

