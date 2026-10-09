import { TableSchemaField } from 'smartbox-tables';
import { InteractiveTableSchema } from './table-schema-utils';

const field = (name: string): TableSchemaField => ({ name, field: name });

const schema = () =>
  new InteractiveTableSchema({
    countPerPage: 20,
    fields: [field('name'), field('status')],
  });

describe('InteractiveTableSchema', () => {
  it('removes fields and inserts around an existing one', () => {
    const next = schema()
      .removeFields('status')
      .addFieldAtTheBeginning(field('id'))
      .addFieldAfter('name', field('email'))
      .addFieldAtTheEnd(field('actions'));

    expect(next.fields.map((item) => item.field)).toEqual([
      'id',
      'name',
      'email',
      'actions',
    ]);
  });

  it('replaces one field and throws when the anchor is missing', () => {
    const next = schema().modifyFieldStatic('name', { sortable: true });
    expect(next.getField('name').sortable).toBe(true);

    expect(() => schema().addFieldAfter('missing', field('email'))).toThrow(
      'Invalid field name (not found): missing',
    );
    expect(() => schema().getField('missing')).toThrow(
      'Invalid field name (not found): missing',
    );
  });
});
