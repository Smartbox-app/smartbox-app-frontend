import { FieldType, TableSchema } from '../typings';

export const documentList: TableSchema = {
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
    },
    {
      name: 'Data modyfikacji',
      field: 'updatedAt',
      mobile: true,
      searchable: false,
      sortable: true,
      defaultSort: true,
      type: FieldType.Date,
    },
    {
      name: 'Typ',
      field: 'type',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
  ],
};
