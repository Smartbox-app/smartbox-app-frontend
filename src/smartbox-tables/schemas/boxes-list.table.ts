import { FieldType, TableSchema } from '../typings';

export const boxesList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'Nr skrytki',
      field: 'identifier',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: true,
      type: FieldType.Text,
      sortType: 'number'
    },
    {
      name: 'Powierzchnia',
      field: 'area',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
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
    {
      name: 'Status',
      field: 'status',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
  
  ],
};
