import { detectBrowserLanguage } from 'src/i18n/app-language';
import SessionService from 'src/services/session-service';

describe('SessionService language', () => {
  const getItem = localStorage.getItem as jest.Mock;

  afterEach(() => {
    getItem.mockReset();
    getItem.mockImplementation((key?: string) =>
      key === 'language' ? JSON.stringify('pl') : null,
    );
  });

  it('returns a stored language', () => {
    getItem.mockReturnValue(JSON.stringify('en'));

    expect(SessionService.getCurrentLanguage()).toBe('en');
  });

  it('uses the browser language when nothing valid is stored', () => {
    getItem.mockReturnValue(null);

    expect(SessionService.getCurrentLanguage()).toBe(detectBrowserLanguage());
  });

  it('ignores a malformed stored value', () => {
    getItem.mockReturnValue('{');

    expect(SessionService.getCurrentLanguage()).toBe(detectBrowserLanguage());
  });
});
