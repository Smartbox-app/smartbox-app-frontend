import { UserCommonEntity } from '../reducers/user-reducer';

export default class SessionService {
  static setCurrentLanguage(lang: string) {
    localStorage.setItem('language', JSON.stringify(lang));
  }

  static getCurrentLanguage() {
    return JSON.parse(localStorage.getItem('language') || 'null') || 'pl';
  }

  static setUser(user: UserCommonEntity) {
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

  static getUser(): UserCommonEntity {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }
}
