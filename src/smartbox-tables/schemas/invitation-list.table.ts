import { FieldType, TableSchema } from '../typings';

const roleToText: {
  [key: string]: string;
} = {
  Administrator: 'Administrator',
  Pracownik: 'Pracownik',
  Użytkownik: 'Użytkownik',
};

export const invitationList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'Email',
      field: 'email',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: true,
      type: FieldType.Email,
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
  ],
};
