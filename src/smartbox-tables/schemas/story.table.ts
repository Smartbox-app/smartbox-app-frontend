import { FieldType, TableSchema } from '../typings';

const statusFields = [
  { name: 'Nowy status', field: 'newStatus', mobile: true, searchable: true, sortable: true, defaultSort: false, type: FieldType.Text },
  { name: 'Poprzedni status', field: 'oldStatus', mobile: true, searchable: true, sortable: true, defaultSort: false, type: FieldType.Text },
  { name: 'Data', field: 'date', mobile: true, searchable: true, sortable: true, defaultSort: true, type: FieldType.Date },
  { name: 'Numer', field: 'box', mobile: true, searchable: true, sortable: true, defaultSort: false, type: FieldType.Text },
  { name: 'Wynajęty od', field: 'rentFromAt', mobile: true, searchable: true, sortable: true, defaultSort: false, type: FieldType.Date },
  { name: 'Wynajęty do', field: 'rentToAt', mobile: true, searchable: true, sortable: true, defaultSort: false, type: FieldType.Date },
  { name: 'Mail najemcy', field: 'tenantEmail', mobile: true, searchable: true, sortable: true, defaultSort: false, type: FieldType.Email },
]

export const StockStatusTable: TableSchema = {
  countPerPage: 20,
  fields: [
    { name: 'Pracownik', field: 'workerName', mobile: true, searchable: false, sortable: false, defaultSort: false, type: FieldType.Text, },
    { name: 'Typ użytkownika', field: 'role', mobile: true, searchable: false, sortable: false, defaultSort: false, type: FieldType.Text, },
    ...statusFields,
  ]
};

export const WorkerStatusTable: TableSchema = {
  countPerPage: 20,
  fields: [
    { name: 'Nazwa placu', field: 'stockName', mobile: true, searchable: false, sortable: false, defaultSort: false, type: FieldType.Text, },
    ...statusFields,
  ]
};
