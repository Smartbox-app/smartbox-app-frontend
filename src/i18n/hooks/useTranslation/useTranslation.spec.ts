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
  it('correctly translates value without parameters', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    const translated = result.current.t('application.management');

    expect(translated).toEqual(application.application.management);
  });

  it('correctly translates value with parameter', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    const translated = result.current.t('validation.min_chars', {
      length: 5,
    });

    expect(translated).toEqual(
      application.validation.min_chars.replace('{{length}}', '5'),
    );
  });

  it('correctly renders value with incorrect key', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    const translated = result.current.t(
      'incorrect_key_that_does_not_exist' as I18nResourceKey,
    );

    expect(translated).toEqual('incorrect_key_that_does_not_exist');
  });
});
