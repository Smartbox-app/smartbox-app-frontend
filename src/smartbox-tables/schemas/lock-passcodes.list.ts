import { FieldType, TableSchema } from '../typings';

export const lockPasscodesList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'application.tables.id',
      field: 'keyboardPwdId',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.name',
      field: 'keyboardPwdName',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.code',
      field: 'keyboardPwd',
      mobile: true,
      searchable: true,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.validFrom',
      field: 'startDate',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Date,
    },
    {
      name: 'application.tables.validTo',
      field: 'endDate',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Date,
    },
  ],
};
