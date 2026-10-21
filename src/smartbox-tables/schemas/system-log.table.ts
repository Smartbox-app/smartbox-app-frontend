import { ApiErrorCode } from 'smartbox-types';
import { translateApiErrorCode } from '../../utils/trans-form';
import { currentAppLanguage } from '../../i18n/app-language';
import { FieldType, TableSchema } from '../typings';
import { translateSystemLogAction } from './system-log-actions';

export const systemLogTableSchema: TableSchema = {
  countPerPage: 50,
  fields: [
    {
      name: 'Data',
      field: 'timestamp',
      type: FieldType.Date,
      sortable: true,
      searchable: true,
      defaultSort: true,
      oppositeSortDir: false,
      mobile: true,
    },
    {
      name: 'Akcja',
      field: 'action',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      customValue: (row: { action?: string | null }) =>
        translateSystemLogAction(row.action),
      mobile: true,
    },
    {
      name: 'Email',
      field: 'userEmail',
      type: FieldType.Email,
      sortable: true,
      searchable: true,
      mobile: true,
    },
    {
      name: 'Rola',
      field: 'userRole',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      mobile: true,
    },

    {
      name: 'Błąd',
      field: 'appErrorCode',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      mobile: true,
      customValue: (row: { appErrorCode?: string | number | null }) => {
        const code = row.appErrorCode;
        if (code === null || code === undefined || code === '') return '-';
        return translateApiErrorCode(Number(code) as ApiErrorCode, currentAppLanguage());
      },
    },
    {
      name: 'IP',
      field: 'ip',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
    },
    {
      name: 'Meta',
      field: 'meta',
      type: FieldType.Text,
      sortable: false,
      searchable: false,
    },
  ],
};
