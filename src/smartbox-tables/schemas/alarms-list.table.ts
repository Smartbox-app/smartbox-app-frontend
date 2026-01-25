import { FieldType, TableSchema } from '../typings';

export const alarmsList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'Identyfikator',
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
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'Ostatnie połączenie',
      field: 'lastConnection',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Date,
    },
    {
      name: 'Status',
      field: 'alarmState',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
  ],
};
