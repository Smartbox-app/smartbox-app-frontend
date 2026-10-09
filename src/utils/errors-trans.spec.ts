import { format, translateErrors } from './errors-trans';

describe('error translation', () => {
  it('replaces numbered placeholders and leaves missing ones', () => {
    expect(format('Hello {0}', ['Ada'])).toBe('Hello Ada');
    expect(format('Hello {0}', [])).toBe('Hello {0}');
  });

  it('translates the first error and fills its placeholders', () => {
    expect(
      translateErrors([
        {
          messageWithPlaceholders: 'Value too low. Min. {0}.',
          messageCompiled: '',
          params: ['5'],
        },
      ]),
    ).toEqual([
      {
        messageWithPlaceholders: 'Wartość za mała. Min. {0}.',
        messageCompiled: 'Wartość za mała. Min. 5.',
        params: ['5'],
      },
    ]);
  });

  it('returns an empty list unchanged', () => {
    expect(translateErrors([])).toEqual([]);
  });
});
