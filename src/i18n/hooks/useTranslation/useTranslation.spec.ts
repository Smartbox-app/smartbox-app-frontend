import { renderHook } from '@testing-library/react';
import React, { type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

import { useI18n } from 'src/i18n/hooks/useTranslation/useTranslation';
import { i18next } from 'src/i18n/i18n';
import application from 'src/i18n/locales/pl/application';
import type { I18nResourceKey } from 'src/i18n/types';

const wrapper = ({ children }: { children: ReactNode }) =>
  React.createElement(I18nextProvider, { i18n: i18next }, children);

describe('useTranslation', () => {
  it('uses a string argument as the fallback for a missing key', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    expect(
      result.current.t('missing.key' as I18nResourceKey, 'fallback text'),
    ).toBe('fallback text');
  });

  it('strips characters the interpolator does not allow', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    expect(
      result.current.t('validation.min_chars', { length: '<b>5</b>' }),
    ).toBe(application.validation.min_chars.replace('{{length}}', 'b5b'));
  });
});
