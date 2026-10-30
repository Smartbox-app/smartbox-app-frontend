import { FieldType, TableSchema } from 'src/smartbox-tables/typings';

const roleToText: {
  [key: string]: string;
} = {
  Administrator: 'application.tables.roleAdministrator',
  Pracownik: 'application.tables.roleWorker',
  Użytkownik: 'application.tables.roleUser',
};

export const invitationList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'application.tables.email',
      field: 'email',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: true,
      type: FieldType.Email,
    },
    {
      name: 'application.tables.role',
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
