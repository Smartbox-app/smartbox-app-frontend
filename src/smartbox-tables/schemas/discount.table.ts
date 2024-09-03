import { FieldType, TableSchema } from '../typings';

export const discounTable: TableSchema = {
  countPerPage: 20,
  fields: [
    { name: 'Nazwa placu', field: 'name', mobile: true, searchable: false, sortable: false, defaultSort: false, type: FieldType.Text },
    { name: 'Wartość zniżki [%]', field: 'value', mobile: true, searchable: true, sortable: true, defaultSort: false, type: FieldType.Text },
    { name: 'Data wygaśnięcia', field: 'expireAt', mobile: true, searchable: true, sortable: true, defaultSort: true, type: FieldType.Date },
  ]
};
