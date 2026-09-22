import { FieldType, TableSchema } from '../typings';
import { BoxStatus, RentStatus } from 'smartbox-types';

const statusToText: {
  [key: string]: string;
} = {
  [BoxStatus.free]: 'Wolny',
  [BoxStatus.outOfService]: 'Wyłączony z użytku',
  [RentStatus.reserved]: 'Zarezerwowany',
  [RentStatus.rented]: 'Wynajęty',
  [RentStatus.pendingFinish]: 'Oczekuje na zakończenie',
  [RentStatus.noPaidExtension]: 'Nieopłacone przedłużenie',
  [RentStatus.noPaidExtensionWithWarning]:
    'Nieopłacone przedłużenie z wykrzyknikiem',
  [RentStatus.noPaidPeriod]: 'Nieopłacony okres',
  [RentStatus.toCheck]: 'Do sprawdzenia',
  [RentStatus.toExplain]: 'Do wyjaśnienia',
  [RentStatus.finished]: 'Zakończone',
  [RentStatus.failure]: 'Zakończone bez wynajęcia',
};

export const boxesList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'Nr skrytki',
      field: 'identifier',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: true,
      oppositeSortDir: true,
      type: FieldType.Text,
    },
    {
      name: 'Powierzchnia',
      field: 'area',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'Cennik',
      field: 'pricing',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Custom,
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
    {
      name: 'Rozliczenie',
      field: 'companyName',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
      alias: 'company',
      entityFieldName: 'name',
    },
  ],
};
