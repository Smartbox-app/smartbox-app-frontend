import { UserRes } from 'smartbox-types';

export default class SessionService {
  static setCurrentLanguage(lang: string) {
    localStorage.setItem('language', JSON.stringify(lang));
  }

  static getCurrentLanguage() {
    return JSON.parse(localStorage.getItem('language') || 'null') || 'pl';
  }


  static clearSessionStorage() {
    localStorage.clear();
    sessionStorage.clear();
  }
}
