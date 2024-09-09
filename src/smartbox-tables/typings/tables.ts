export enum FieldType {
    Text,
    Custom,
    Url,
    Email,
    Tel,
    Img,
    Date,
    Boolean,
    Price,
    Percent,
}

export interface TableButton {
    name: string,
    type: string,
    to?: string | ((data?: any) => string),
    click?: any,
}

export interface TableFieldSearchableValues {
    [key: string]: string;
    [key: number]: string;
}

export interface TableSchemaField {
    name: string;
    field: string;
    type?: FieldType; // defaults to Text
    customValue?: (values: any, field: TableSchemaField) => any;
    customRender?: (value: any, field: TableSchemaField, allValues: any) => any;
    mobile?: boolean;
    link?: boolean;
    sortable?: boolean;
    searchable?: boolean;
    defaultSort?: boolean;
    oppositeSortDir?: boolean;
    buttons?: TableButton[];
    searchableValues?: TableFieldSearchableValues;
    defaultSearch?: string|number;
    alias?: string;
    sortType?: string;
}

export interface TableSchema {
    countPerPage: number;
    fields: TableSchemaField[];
}

export interface TableQuery {
    searchBy?: string;
    searchQuery?: string;
    page?: number;
    sortBy?: string;
    sortDirBack?: boolean;
}

export interface TableResponse<T> {
    countTotal: number;
    items: T[];
}