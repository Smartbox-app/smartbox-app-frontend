import type { I18nResourceKey } from 'src/i18n/types/keys';

export type ApiEndpointDoc = {
  slug: string;
  method: 'GET';
  path: string;
  tab: I18nResourceKey;
  description: I18nResourceKey;
};

export const useApiAccessEndpoints = (): ApiEndpointDoc[] => [
  {
    slug: 'box-groups',
    method: 'GET',
    path: '/public/box-groups',
    tab: 'application.apiAccessScopeBoxGroupsRead',
    description: 'application.apiAccessBoxGroupsDescription',
  },
  {
    slug: 'boxes',
    method: 'GET',
    path: '/public/box-groups/boxes',
    tab: 'application.apiAccessScopeBoxGroupsReadBoxes',
    description: 'application.apiAccessBoxGroupsBoxesDescription',
  },
];
