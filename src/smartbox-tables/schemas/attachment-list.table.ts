import { FieldType, TableSchema } from 'src/smartbox-tables/typings';

export const attachmentList: TableSchema = {
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
    },
    {
      name: 'application.tables.name',
      field: 'name',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: true,
      type: FieldType.Text,
    },
  ],
};
