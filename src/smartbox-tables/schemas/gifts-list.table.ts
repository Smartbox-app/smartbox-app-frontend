import { FieldType, TableSchema } from '../typings';

const roleToText: {
    [key: string]: string;
  } = {
    Administrator: 'Administrator',
    Pracownik: 'Pracownik',
    Użytkownik: 'Użytkownik',
  };

export const giftsListTable: TableSchema = {
    countPerPage: 20,
    fields: [
        {
            name: 'Kod',
            field: 'code',
            mobile: true,
            searchable: true,
            sortable: true,
            defaultSort: true,
            type: FieldType.Text,
        },
        {
            name: 'Typ',
            field: 'type',
            mobile: true,
            searchable: true,
            sortable: true,
            defaultSort: false,
            type: FieldType.Text,
        },
        {
            name: 'Aktywny',
            field: 'active',
            mobile: true,
            searchable: true,
            sortable: true,
            defaultSort: false,
            type: FieldType.Boolean,
        },
        {
            name: 'Maksymalnie użyć',
            field: 'count',
            mobile: true,
            searchable: true,
            sortable: true,
            defaultSort: false,
            type: FieldType.Text,
        },
        {
            name: 'Pozostało użyć',
            field: 'countLeft',
            mobile: true,
            searchable: true,
            sortable: true,
            defaultSort: false,
            type: FieldType.Text,
        },
        {
            name: 'Minimalny okres wynajmu',
            field: 'minRentPeriod',
            mobile: true,
            searchable: true,
            sortable: true,
            defaultSort: false,
            type: FieldType.Text,
        },
        {
            name: 'Na okres',
            field: 'duration',
            mobile: true,
            searchable: true,
            sortable: true,
            defaultSort: false,
            type: FieldType.Text,
        },
        {
            name: 'Zniżka',
            field: 'discount',
            mobile: true,
            searchable: true,
            sortable: true,
            defaultSort: false,
            type: FieldType.Text,
        },
    ],
};
