import { FieldType, TableSchema } from 'src/smartbox-tables/typings';

const configTypeToText: {
  [key: string]: string;
} = {
  web: 'application.tables.versionWeb',
  ios: 'application.tables.versionIos',
  ios_review: 'application.tables.versionIosReview',
  android: 'application.tables.versionAndroid',
  android_review: 'application.tables.versionAndroidReview',
  ios_maintenance: 'application.tables.maintenanceIos',
  android_maintenance: 'application.tables.maintenanceAndroid',
};

export const mobileConfigTableSchema: TableSchema = {
  countPerPage: 10,
  fields: [
    {
      name: 'application.tables.type',
      field: 'type',
      searchable: true,
      sortable: true,
      type: FieldType.Text,
      customValue: (value: { type: string }) => configTypeToText[value.type],
    },
    {
      name: 'application.tables.appId',
      field: 'appId',
      searchable: true,
      sortable: true,
      defaultSort: true,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.value',
      field: 'value',
      searchable: false,
      sortable: false,
      type: FieldType.Text,
    },
  ],
};
