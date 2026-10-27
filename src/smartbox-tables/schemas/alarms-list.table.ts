import { FieldType, TableSchema } from 'src/smartbox-tables/typings';

export const alarmsList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'application.tables.identifier',
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
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.lastConnection',
      field: 'lastConnection',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Date,
    },
    {
      name: 'application.tables.status',
      field: 'alarmState',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
  ],
};
