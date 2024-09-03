import { FieldType, TableSchema } from '../typings';

export const rentsList: TableSchema = {
    countPerPage: 20,
    fields: [
        {
            name: 'ID',
            field: 'id',
            mobile: false,
            searchable: false,
            sortable: false,
            defaultSort: false,
            type: FieldType.Text,
        },
        {
            name: 'User ID',
            field: 'userId',
            mobile: false,
            searchable: false,
            sortable: false,
            defaultSort: false,
            type: FieldType.Text,
        },
        {
            name: 'Utworzono',
            field: 'createdAt',
            mobile: true,
            searchable: true,
            sortable: true,
            defaultSort: true,
            type: FieldType.Date,
            alias: 'r'
        },
        {
            name: 'Początek',
            field: 'startAt',
            mobile: true,
            searchable: true,
            sortable: true,
            defaultSort: false,
            type: FieldType.Date,
            alias: 'r'
        },
        {
            name: 'Koniec',
            field: 'finishAt',
            mobile: true,
            searchable: true,
            sortable: true,
            defaultSort: false,
            type: FieldType.Date,
            alias: 'r'
        },
        {
            name: 'Numer',
            field: 'number',
            mobile: true,
            searchable: true,
            sortable: true,
            defaultSort: false,
            type: FieldType.Text,
            alias: 'r'
        },
        {
            name: 'Status',
            field: 'status',
            mobile: true,
            searchable: true,
            sortable: true,
            defaultSort: false,
            type: FieldType.Text,
            oppositeSortDir: true,
            alias: 'r'
        },
        {
            name: 'Imię',
            field: 'firstName',
            mobile: true,
            searchable: false,
            sortable: false,
            defaultSort: false,
            type: FieldType.Text,
            alias: 'user'
        },
        {
            name: 'Nazwisko',
            field: 'lastName',
            mobile: true,
            searchable: false,
            sortable: false,
            defaultSort: false,
            type: FieldType.Text,
            alias: 'user'
        },
        {
            name: 'Email',
            field: 'email',
            mobile: true,
            searchable: false,
            sortable: false,
            defaultSort: false,
            type: FieldType.Text,
            alias: 'user'
        },

    ],
};
