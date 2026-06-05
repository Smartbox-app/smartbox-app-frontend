import { i18next } from '../i18n/i18n';
import SessionService from '../services/session-service';

export class I18n {
  loaded = true;

  langNames = ['pl', 'en'];

  currentLang: string | null = i18next.language;

  async load(lang: string, clb?: () => void) {
    await i18next.changeLanguage(lang);
    this.currentLang = i18next.language;
    if (typeof clb === 'function') {
      clb();
    }
  }

  __(key: string, options?: Record<string, unknown>) {
    return i18next.t(key, options);
  }

  changeLang(newLang: string) {
    if (i18next.language === newLang) return;
    SessionService.setCurrentLanguage(newLang);
    window.location.reload();
  }
}

export const i18n = new I18n();
export const __ = (text: string, args?: Record<string, unknown>) => i18n.__(text, args);
