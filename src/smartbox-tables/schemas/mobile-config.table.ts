import { FieldType, TableSchema } from "../typings";


const configTypeToText: {
  [key: string]: string;
} = {
  web: 'Wersja web',
  ios: 'Wersja iOS',
  ios_review: 'Wersja iOS w procesie weryfikacji',
  android: 'Wersja Android',
  android_review: 'Wersja Android w procesie weryfikacji',
  ios_maintenance: 'Tryb maintenance iOS',
 android_maintenance: 'Tryb maintenance Android',
};

export const mobileConfigTableSchema: TableSchema = {
  countPerPage: 10,
  fields: [
    {
      name: 'Typ',
      field: 'type',
      searchable: true,
      sortable: true,
      type: FieldType.Text,
      customValue: value => configTypeToText[value.type],
    },
    {
      name: 'Identyfikator aplikacji',
      field: 'appId',
      searchable: true,
      sortable: true,
      defaultSort: true,
      type: FieldType.Text,
    },
    {
      name: 'Wartość',
      field: 'value',
      searchable: false,
      sortable: false,
      type: FieldType.Text,
    },
  ],
};
