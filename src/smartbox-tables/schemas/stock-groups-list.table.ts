import { FieldType, TableSchema } from 'src/smartbox-tables/typings';

export const stockGroupsList: TableSchema = {
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
  ],
};
