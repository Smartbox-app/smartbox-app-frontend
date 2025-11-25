import { FieldType, TableSchema } from '../typings';

export const boxGroupsList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'Nazwa',
      field: 'name',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'Powierzchnia',
      field: 'area',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: true,
      type: FieldType.Text,
      oppositeSortDir: true
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
    {
      name: 'Minimalny okres wynajmu',
      field: 'minRentPeriod',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'Maksymalny okres wynajmu',
      field: 'maxRentPeriod',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
  ],
};
