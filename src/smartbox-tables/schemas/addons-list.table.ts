import { FieldType, TableSchema } from '../typings';

export const addonList: TableSchema = {
  countPerPage: 20,
  fields: [
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
      name: 'Cennik',
      field: 'pricing',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Custom,
    },
  ],
};
