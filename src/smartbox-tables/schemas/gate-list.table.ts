import { FieldType, TableSchema } from '../typings';

export const gateList: TableSchema = {
    countPerPage: 20,
    fields: [
        {
            name: 'Identyfikator',
            field: 'id',
            mobile: true,
            searchable: true,
            sortable: true,
            defaultSort: true,
            type: FieldType.Text,
        },
        {
            name: 'Nazwa',
            field: 'ident',
            mobile: true,
            searchable: true,
            sortable: true,
            defaultSort: false,
            type: FieldType.Text,
        },
        {
            name: 'Kod dostępu',
            field: 'passcode',
            mobile: true,
            searchable: true,
            sortable: true,
            defaultSort: false,
            type: FieldType.Text,
        },
    ],
};
