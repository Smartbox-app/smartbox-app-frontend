import { TableSchema, TableSchemaField } from 'smartbox-tables';
// import { TableSchemaField } from 'smarbox-tables/src/typings/tables';

export class InteractiveTableSchema implements TableSchema {
  public countPerPage = 0;

  public fields: TableSchemaField[] = [];

  constructor(schema: TableSchema) {
    this.countPerPage = schema.countPerPage;
    this.fields = schema.fields;
  }

  removeFields(...fieldNames: string[]): InteractiveTableSchema {
    for (const fieldName of fieldNames) {
      this.fields = this.fields.filter((f) => f.field !== fieldName);
    }
    return this;
  }

  modifyFieldStatic(fieldName: string, newFieldObj: Partial<TableSchemaField>): InteractiveTableSchema {
    this.fields = this.fields.map((f) =>
      f.field === fieldName
        ? {
          ...f,
          ...newFieldObj,
        }
        : f,
    );
    return this;
  }

  modifyFieldDynamic(fieldName: string, clb: (field: TableSchemaField) => TableSchemaField): InteractiveTableSchema {
    this.fields = this.fields.map((f) => (f.field === fieldName ? clb(f) : f));
    return this;
  }

  addFieldAtTheBeginning(field: TableSchemaField): InteractiveTableSchema {
    return this.addFieldAtIndex(0, field);
  }

  addFieldAtTheEnd(field: TableSchemaField): InteractiveTableSchema {
    return this.addFieldAtIndex(this.fields.length, field);
  }

  addFieldAfter(afterFieldName: string, field: TableSchemaField): InteractiveTableSchema {
    const index = this.fields.findIndex((f) => f.field === afterFieldName);
    if (index === -1) {
      throw new Error(`Invalid field name (not found): ${afterFieldName}`);
    }

    return this.addFieldAtIndex(index + 1, field);
  }

  getField(fieldName: string): TableSchemaField {
    const field = this.fields.find((f) => f.field === fieldName);
    if (!field) {
      throw new Error(`Invalid field name (not found): ${fieldName}`);
    }
    return field;
  }

  private addFieldAtIndex(index: number, field: TableSchemaField): InteractiveTableSchema {
    const firstHalf = this.fields.slice(0, index);
    const secondHalf = this.fields.slice(index, this.fields.length);
    this.fields = [...firstHalf, field, ...secondHalf];
    return this;
  }
}
