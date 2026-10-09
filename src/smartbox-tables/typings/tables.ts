import type { ReactNode } from 'react';

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
    to?: string | ((data?: unknown) => string),
    click?(data?: unknown): void,
}

export interface TableFieldSearchableValues {
    [key: string]: string;
    [key: number]: string;
}

export interface TableSchemaField {
    name: string;
    field: string;
    type?: FieldType; // defaults to Text
    customValue?(values: unknown, field: TableSchemaField): unknown;
    customRender?(value: unknown, field: TableSchemaField, allValues: unknown): ReactNode;
    mobile?: boolean;
    link?: boolean;
    sortable?: boolean;
    searchable?: boolean;
    defaultSort?: boolean;
    oppositeSortDir?: boolean;
    buttons?: (TableButton | null)[];
    searchableValues?: TableFieldSearchableValues;
    defaultSearch?: string|number;
    alias?: string;
    entityFieldName?: string;
    sortType?: string;
}

export interface TableSchema {
    countPerPage: number;
    fields: TableSchemaField[];
    highlightRow?: (row: Record<string, unknown>) => boolean;
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