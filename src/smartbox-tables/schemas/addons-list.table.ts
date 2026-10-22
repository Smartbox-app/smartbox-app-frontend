import { FieldType, TableSchema } from '../typings';

export const addonList: TableSchema = {
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
    {
      name: 'application.tables.priceList',
      field: 'pricing',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Custom,
    },
  ],
};
