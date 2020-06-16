import { UserRes } from 'smartbox-types';

export default class SessionService {
  static setCurrentLanguage(lang: string) {
    localStorage.setItem('language', JSON.stringify(lang));
  }

  static getCurrentLanguage() {
    return JSON.parse(localStorage.getItem('language') || 'null') || 'pl';
  }

  // @TODO: fix user type
  static setUser(user: any) {
    return localStorage.setItem('user', JSON.stringify(user));
  }

  static clearSessionStorage() {
    localStorage.clear();
    sessionStorage.clear();
  }

  static clearUserSession() {
    localStorage.removeItem('user');
  }

  static isUserSet() {
    return JSON.parse(localStorage.getItem('user') || 'false');
  }

  static getUser(): UserRes {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }
}
