import { translateSystemLogAction } from './system-log-actions';

describe('translateSystemLogAction', () => {
  it('returns the Polish label for a known action', () => {
    expect(translateSystemLogAction('stock.ksmOpenGateV2')).toBe(
      'Otwarcie bramy',
    );
    expect(translateSystemLogAction('api-access.rotate-key')).toBe(
      'Rotacja klucza API',
    );
    expect(translateSystemLogAction('user.updateMyLang')).toBe(
      'Aktualizacja własnego języka',
    );
    expect(translateSystemLogAction('invoice.issued')).toBe(
      'Wystawienie faktury',
    );
  });

  it('returns the raw key when the action is unknown', () => {
    expect(translateSystemLogAction('stock.unknownAction')).toBe(
      'stock.unknownAction',
    );
  });
});
