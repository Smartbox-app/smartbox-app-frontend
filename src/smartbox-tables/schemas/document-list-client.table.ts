import { FieldType, TableSchema } from '../typings';

export const documentListClient: TableSchema = {
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
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
      alias: 'document',
    },
    {
      name: 'Magazyn',
      field: 'stockName',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
      alias: 'stock',
    },
    {
      name: 'Status',
      field: 'isDraft',
      mobile: true,
      searchable: false,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
      alias: 'document',
    },
  ],
};

