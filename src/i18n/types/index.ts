export type {
  ApplicationResources,
  I18nResourceKey,
  NamingResourceKey,
  NamingTypeKey,
} from './keys';
export { buildNamingResourceKey } from './keys';

/** @deprecated Use I18nResourceKey */
export type { I18nResourceKey as I18nResources } from './keys';

export type Options = Record<string, unknown>;
