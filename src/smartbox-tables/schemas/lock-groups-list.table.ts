import { FieldType, TableSchema } from '../typings';

export const lockGroupsList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'ID',
      field: 'groupId',
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
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
  ],
};
