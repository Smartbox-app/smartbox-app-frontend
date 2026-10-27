
import {
  detectBrowserLanguage,
  isAppLanguage,
  type AppLanguage,
} from 'src/i18n/app-language';

export default class SessionService {
  static setCurrentLanguage(lang: string) {
    if (!isAppLanguage(lang)) return;
    localStorage.setItem('language', JSON.stringify(lang));
  }

  static getCurrentLanguage(): AppLanguage {
    try {
      const raw = localStorage.getItem('language');
      const stored = raw ? JSON.parse(raw) : null;
      if (isAppLanguage(stored)) return stored;
    } catch {
      // Ignore a malformed stored value and use the browser language.
    }

    return detectBrowserLanguage();
  }

  static clearCurrentLanguage() {
    localStorage.removeItem('language');
  }

  static clearSessionStorage() {
    localStorage.clear();
    sessionStorage.clear();
  }
}
