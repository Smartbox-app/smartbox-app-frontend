export enum UserRole {
  admin = 'Administrator',
  worker = 'Pracownik',
  user = 'Użytkownik',
  client = 'Klient',
}

export enum UserRoleForTenant {
  worker = 'Pracownik',
  user = 'Użytkownik',
}

export enum UserStatus {
  active = 'Aktywny',
  blocked = 'Zablokowany',
  preActive = 'Nie aktywowany'
}

export enum Language {
  pl = 'pl',
  en = 'en',
  cz = 'cz',
  ua = 'ua',
  de = 'de',
}
