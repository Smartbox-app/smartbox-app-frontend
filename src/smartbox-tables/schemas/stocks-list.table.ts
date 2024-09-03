import { FieldType, TableSchema } from '../typings';

export const stocksList: TableSchema = {
    countPerPage: 20,
    fields: [
        {
            name: 'Nazwa',
            field: 'name',
            mobile: true,
            searchable: true,
            sortable: true,
            defaultSort: true,
            type: FieldType.Text,
        },
        {
            name: 'Adres',
            field: 'address',
            mobile: true,
            searchable: true,
            sortable: true,
            defaultSort: false,
            type: FieldType.Text,
        },
    ],
};
