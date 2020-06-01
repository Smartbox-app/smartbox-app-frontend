import Polyglot from 'node-polyglot'; // Ta biblioteka dobrze działa
import SessionService from '../services/session-service';
// W konsoli ustawienie `window.DEBUG_SHOW_MISSING_TRANSLATIONS = true` pokaże brakujące translacje
export class I18n {
  loaded: boolean;

  langNames: string[];

  currentLang: string | null;

  polyglot: any;

  constructor() {
    this.loaded = false;
    this.langNames = ['pl', 'en'];
    this.currentLang = 'pl';
  }

  private _isLoaded(emitWarn = true) {
    if (!this.loaded && emitWarn) {
      console.warn('i18n not loaded!');
    }
    return this.loaded;
  }

  async load(lang: string, clb?: any) {
    const response = await fetch(`/assets/i18n/${lang}.json`, { cache: 'no-cache' });
    const i18nInfoData = await response.json();

    // Pobranie listy języków, ale to równie dobrze może być na FE albo najlepiej jako statyczny JSON
    this.polyglot = new Polyglot({
      phrases: i18nInfoData.phrases,
      locale: i18nInfoData.locale,
      // onMissingKey:
      //   window.DEBUG_SHOW_MISSING_TRANSLATIONS === true ? undefined : () => {}
    });

    // Tu warto wybrać język również do biblioteki czasu np. date-fns

    this.currentLang = i18nInfoData.locale;
    this.langNames = i18nInfoData.langNames;
    this.loaded = true;
    if (typeof clb === 'function') {
      clb();
    }
  }

  __(key: any, options: any) {
    if (!this._isLoaded()) return;
    return this.polyglot.t(key, options);
  }

  changeLang(newLang: any) {
    if (!this._isLoaded()) return;
    if (this.polyglot.currentLocale === newLang) return;
    SessionService.setCurrentLanguage(newLang);
    window.location.reload(true);
    // Ja tu miałem po prostu zapisanie nowego języka i odświeżenie strony
    // Dobrze to działa, bo inaczej część tekstów byłaby stara, a nowe podmienione itp
  }
}

export const i18n = new I18n();
export const __ = (text: any, args?: any) => i18n.__(text, args);

// Użycie gdziekolwiek:
// __("Hi, my friend"); // 'Cześć, mój przyjacielu'
// __("Hi, ${name}!", { name: "Test" }); // 'Cześć, Test!'
// Więcej info: https://airbnb.io/polyglot.js/
