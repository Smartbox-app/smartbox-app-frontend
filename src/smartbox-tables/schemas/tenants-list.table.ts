import { FieldType, TableSchema } from '../typings';

const statusToText: {
  [key: string]: string;
} = {
  Aktywny: 'Aktywny',
  Zablokowany: 'Zablokowany',
};

export const tenantsList: TableSchema = {
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
      name: 'Email',
      field: 'email',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Email,
    },
    {
      name: 'Imię',
      field: 'firstName',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'Nazwisko',
      field: 'lastName',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'Telefon',
      field: 'phone',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Tel,
    },
    {
      name: 'Status',
      field: 'status',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: true,
      type: FieldType.Text,
      searchableValues: statusToText,
    },
  ],
};
