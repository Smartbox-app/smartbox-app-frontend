import { ApiErrorCode } from 'smartbox-types';
import { currentAppLanguage } from 'src/i18n/app-language';
import { translateSystemLogAction } from 'src/smartbox-tables/schemas/system-log-actions';
import { FieldType, TableSchema } from 'src/smartbox-tables/typings';
import { translateApiErrorCode } from 'src/utils/trans-form';

export const systemLogAdminTableSchema: TableSchema = {
  countPerPage: 50,
  fields: [
    {
      name: 'application.tables.date',
      field: 'timestamp',
      type: FieldType.Date,
      sortable: true,
      searchable: true,
      defaultSort: true,
      oppositeSortDir: false,
      mobile: true,
    },
    {
      name: 'application.tables.action',
      field: 'action',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      customValue: (row: { action?: string | null }) =>
        translateSystemLogAction(row.action),
      mobile: true,
    },
    {
      name: 'application.tables.email',
      field: 'userEmail',
      type: FieldType.Email,
      sortable: true,
      searchable: true,
      mobile: true,
    },
    {
      name: 'application.tables.role',
      field: 'userRole',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
      mobile: true,
    },
    {
      name: 'application.tables.status',
      field: 'statusCode',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
    },
    {
      name: 'application.tables.error',
      field: 'appErrorCode',
      type: FieldType.Text,
      sortable: false,
      searchable: false,
      mobile: true,
      customValue: (row: { appErrorCode?: string | number | null }) => {
        const code = row.appErrorCode;
        if (code === null || code === undefined || code === '') return '-';
        return translateApiErrorCode(
          Number(code) as ApiErrorCode,
          currentAppLanguage(),
        );
      },
    },
    {
      name: 'application.tables.ip',
      field: 'ip',
      type: FieldType.Text,
      sortable: true,
      searchable: true,
    },
    {
      name: 'application.tables.customer',
      field: 'tenantId',
      type: FieldType.Text,
      sortable: false,
      searchable: false,
    },
    {
      name: 'application.tables.meta',
      field: 'meta',
      type: FieldType.Text,
      sortable: false,
      searchable: false,
    },
  ],
};
