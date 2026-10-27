import { useMutation } from '@tanstack/react-query';

import type { AppLanguage } from 'src/i18n/app-language';
import ApiService from 'src/services/api-service';
import SessionService from 'src/services/session-service';

export const useUpdateMyLangMutation = () => {
  return useMutation({
    mutationFn: async (lang: AppLanguage) => {
      await ApiService.callFetch(
        'PATCH',
        'user/me/lang',
        undefined,
        undefined,
        { lang },
        true,
      );
      SessionService.setCurrentLanguage(lang);
    },
  });
};
