import { FieldType, TableSchema } from '../typings';

export const lockPasscodesList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'ID',
      field: 'keyboardPwdId',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'Nazwa',
      field: 'keyboardPwdName',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'Kod',
      field: 'keyboardPwd',
      mobile: true,
      searchable: true,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'Ważne od',
      field: 'startDate',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Date,
    },
    {
      name: 'Ważne do',
      field: 'endDate',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Date,
    },
  ],
};
