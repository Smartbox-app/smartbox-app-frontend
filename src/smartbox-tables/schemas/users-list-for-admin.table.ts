import { FieldType, TableSchema } from '../typings';

const roleToText: {
  [key: string]: string;
} = {
  Administrator: 'Administrator',
  Pracownik: 'Pracownik',
};

const statusToText: {
  [key: string]: string;
} = {
  Aktywny: 'Aktywny',
  Zablokowany: 'Zablokowany',
};

export const usersListForAdmin: TableSchema = {
  countPerPage: 20,
  fields: [
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
      name: 'Data rejestracji',
      field: 'createdAt',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: true,
      type: FieldType.Date,
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
      name: 'Rola',
      field: 'role',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
      searchableValues: roleToText,
    },
    {
      name: 'Franczyzobiorca',
      field: 'tenant',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'Status',
      field: 'status',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
      searchableValues: statusToText,
    },
  ],
};
