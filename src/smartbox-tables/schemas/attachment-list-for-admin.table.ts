import { FieldType, TableSchema } from '../typings';

export const attachmentListForAdmin: TableSchema = {
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
      searchable: true,
      sortable: true,
      defaultSort: true,
      type: FieldType.Text,
    },
  ],
};
