import { FieldType, TableSchema } from 'src/smartbox-tables/typings';

export const lockGroupsList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'application.tables.id',
      field: 'groupId',
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
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
  ],
};
