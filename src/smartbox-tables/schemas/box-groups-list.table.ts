import { FieldType, TableSchema } from 'src/smartbox-tables/typings';

export const boxGroupsList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'application.tables.name',
      field: 'name',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.area',
      field: 'area',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: true,
      type: FieldType.Text,
      oppositeSortDir: true,
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
    {
      name: 'application.tables.minRentPeriod',
      field: 'minRentPeriod',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.maxRentPeriod',
      field: 'maxRentPeriod',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
  ],
};
