import { FieldType, TableSchema } from '../typings';

export const companyList: TableSchema = {
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
  ],
};
