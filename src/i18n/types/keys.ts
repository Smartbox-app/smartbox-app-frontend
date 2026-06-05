import type application from '../locales/pl/application';

type Join<L extends string, R extends string> = L extends '' ? R : `${L}.${R}`;

/** Dot-separated paths to string leaf values in the locale tree. */
export type LeafKeyPaths<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? LeafKeyPaths<T[K], Join<Prefix, K>>
        : Join<Prefix, K>;
    }[keyof T & string]
  : never;

export type ApplicationResources = typeof application;

export type I18nResourceKey = LeafKeyPaths<ApplicationResources>;

/** Keys shared by `naming.stock` and `naming.location` (tenant-specific wording). */
export type NamingTypeKey = keyof typeof application.naming.stock &
  keyof typeof application.naming.location;

export type NamingResourceKey =
  | `naming.stock.${NamingTypeKey}`
  | `naming.location.${NamingTypeKey}`;

export const buildNamingResourceKey = (
  namingType: 'stock' | 'location',
  key: NamingTypeKey,
): NamingResourceKey => `naming.${namingType}.${key}`;
