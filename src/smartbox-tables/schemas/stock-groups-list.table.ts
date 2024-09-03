import { FieldType, TableSchema } from '../typings';

export const stockGroupsList: TableSchema = {
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
    ],
};
