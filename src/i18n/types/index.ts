export type {
  ApplicationResources,
  I18nResourceKey,
  NamingResourceKey,
  NamingTypeKey,
} from 'src/i18n/types/keys';
export { buildNamingResourceKey } from 'src/i18n/types/keys';

/** @deprecated Use I18nResourceKey */
export type { I18nResourceKey as I18nResources } from 'src/i18n/types/keys';

export type Options = Record<string, unknown>;
