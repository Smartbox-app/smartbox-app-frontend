import { renderHook } from '@testing-library/react';
import React, { type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

import application from '../../locales/pl/application';
import { i18next } from '../../i18n';
import type { I18nResourceKey } from '../../types';
import { useI18n } from './useTranslation';

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
