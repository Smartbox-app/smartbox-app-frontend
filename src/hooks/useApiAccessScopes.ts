import { PublicApiScope } from 'smartbox-types';
import { useI18n } from 'src/i18n';

const normalizeScopes = (raw: unknown): string[] => {
  if (Array.isArray(raw)) {
    return raw.map((scope) => String(scope)).filter(Boolean);
  }

  if (typeof raw === 'string') {
    return raw
      .split(',')
      .map((scope) => scope.trim())
      .filter(Boolean);
  }

  return [];
};

export const useApiAccessScopes = () => {
  const { t } = useI18n();

  return {
    scopeOptions: [
      {
        value: PublicApiScope.BoxGroupsRead,
        label: t('application.apiAccessScopeBoxGroupsRead'),
      },
      {
        value: PublicApiScope.BoxGroupsReadBoxes,
        label: t('application.apiAccessScopeBoxGroupsReadBoxes'),
      },
    ],
    normalizeScopes,
  };
};
