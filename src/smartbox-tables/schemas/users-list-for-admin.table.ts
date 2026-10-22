import { FieldType, TableSchema } from '../typings';

const roleToText: {
  [key: string]: string;
} = {
  Administrator: 'application.tables.roleAdministrator',
  Pracownik: 'application.tables.roleWorker',
};

const statusToText: {
  [key: string]: string;
} = {
  Aktywny: 'application.tables.statusActive',
  Zablokowany: 'application.tables.statusBlocked',
};

export const usersListForAdmin: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'application.tables.email',
      field: 'email',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Email,
    },
    {
      name: 'application.tables.registered',
      field: 'createdAt',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: true,
      type: FieldType.Date,
    },
    {
      name: 'application.tables.firstName',
      field: 'firstName',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.lastName',
      field: 'lastName',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.phone',
      field: 'phone',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Tel,
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
    {
      name: 'application.tables.franchisee',
      field: 'tenant',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.passwordSet',
      field: 'hasPasswordSet',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Boolean,
    },
    {
      name: 'application.tables.status',
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
