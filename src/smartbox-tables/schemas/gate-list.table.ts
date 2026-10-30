import { FieldType, TableSchema } from 'src/smartbox-tables/typings';

export const gateList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'application.tables.identifier',
      field: 'id',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: true,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.name',
      field: 'ident',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.accessCode',
      field: 'passcode',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
  ],
};
