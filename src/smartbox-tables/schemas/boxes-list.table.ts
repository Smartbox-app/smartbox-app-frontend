import { FieldType, TableSchema } from '../typings';
import { BoxStatus, RentStatus } from 'smartbox-types';

const statusToText: {
  [key: string]: string;
} = {
  [BoxStatus.free]: 'application.rentStatus.free',
  [BoxStatus.outOfService]: 'application.rentStatus.outOfService',
  [RentStatus.reserved]: 'application.rentStatus.reserved',
  [RentStatus.rented]: 'application.rentStatus.rented',
  [RentStatus.pendingFinish]: 'application.rentStatus.pendingFinish',
  [RentStatus.awaitingFinish]: 'application.rentStatus.awaitingFinish',
  [RentStatus.noPaidExtension]: 'application.rentStatus.noPaidExtension',
  [RentStatus.noPaidExtensionWithWarning]:
    'application.rentStatus.noPaidExtensionWithWarning',
  [RentStatus.noPaidPeriod]: 'application.rentStatus.noPaidPeriod',
  [RentStatus.toCheck]: 'application.rentStatus.toCheck',
  [RentStatus.toExplain]: 'application.rentStatus.toExplain',
  [RentStatus.finished]: 'application.rentStatus.finished',
  [RentStatus.failure]: 'application.rentStatus.failure',
  [RentStatus.endedUnpaid]: 'application.rentStatus.endedUnpaid',
};

export const boxesList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'application.tables.lockerNumber',
      field: 'identifier',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: true,
      oppositeSortDir: true,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.area',
      field: 'area',
      mobile: true,
      searchable: true,
      sortable: true,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.priceList',
      field: 'pricing',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Custom,
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
    {
      name: 'application.tables.settlement',
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
