import { renderHook } from '@testing-library/react';

import { useTemplateListQuery } from 'src/queries';

import type {
  TemplateChannelGroup,
  TemplateSection,
  TemplateSectionRow,
} from './types';
import { useTemplateSections } from './useTemplateSections';

jest.mock('src/queries', () => ({
  useTemplateListQuery: jest.fn(),
}));

const mockedQuery = useTemplateListQuery as jest.Mock;

const row = (overrides: {
  id: string;
  type: string;
  channel: 'email' | 'sms';
  lang?: 'pl' | 'en';
  forStock?: boolean;
  stockNames?: string;
}) => ({
  stockNames: '',
  forStock: false,
  lang: 'pl' as const,
  isDefault: true,
  canOverride: true,
  ...overrides,
});

const langOf = (
  section: TemplateSection<TemplateSectionRow>,
  code: string,
) => section.languages.find((entry) => entry.lang === code);

const ids = (groups: TemplateChannelGroup<TemplateSectionRow>[]) =>
  groups.map((group) => group.generic.id);

const stockIds = (group?: TemplateChannelGroup<TemplateSectionRow>) =>
  group?.stocks.map((stock) => stock.id) ?? [];

describe('useTemplateSections', () => {
  beforeEach(() => {
    mockedQuery.mockReturnValue({ data: [], isPending: false });
  });

  it('groups email and sms under the same language', () => {
    mockedQuery.mockReturnValue({
      data: [
        row({
          id: 'email',
          type: 'auto_payment_failed_email',
          channel: 'email',
        }),
        row({
          id: 'sms',
          type: 'auto_payment_failed_sms',
          channel: 'sms',
        }),
        row({
          id: 'stock',
          type: 'auto_payment_failed_sms',
          channel: 'sms',
          forStock: true,
          stockNames: 'Plac',
        }),
      ],
      isPending: false,
    });

    const { result } = renderHook(() => useTemplateSections());
    const pl = langOf(result.current.sections[0], 'pl');

    expect(result.current.sections).toHaveLength(1);
    expect(result.current.sections[0].label).toBe(
      'Automatyczna płatność zakończona porażką',
    );
    expect(result.current.sections[0].languages.map((entry) => entry.lang)).toEqual([
      'pl',
    ]);
    expect(ids(pl?.email ?? [])).toEqual(['email']);
    expect(stockIds(pl?.sms[0])).toEqual(['stock']);
  });

  it('keeps an email-only template in the email subsection', () => {
    mockedQuery.mockReturnValue({
      data: [
        row({
          id: 'admin',
          type: 'invite_user_email',
          channel: 'email',
        }),
      ],
      isPending: false,
    });

    const { result } = renderHook(() => useTemplateSections());
    const pl = langOf(result.current.sections[0], 'pl');

    expect(pl?.email).toHaveLength(1);
    expect(pl?.sms).toHaveLength(0);
  });

  it('nests stock templates under the language they were saved in', () => {
    mockedQuery.mockReturnValue({
      data: [
        row({ id: 'pl', type: 'new_rental_email', channel: 'email' }),
        row({ id: 'en', type: 'new_rental_email', channel: 'email', lang: 'en' }),
        row({
          id: 'pl-stock',
          type: 'new_rental_email',
          channel: 'email',
          forStock: true,
          stockNames: 'Plac',
        }),
        row({
          id: 'en-stock',
          type: 'new_rental_email',
          channel: 'email',
          lang: 'en',
          forStock: true,
          stockNames: 'Yard',
        }),
      ],
      isPending: false,
    });

    const { result } = renderHook(() => useTemplateSections());
    const section = result.current.sections[0];
    const pl = langOf(section, 'pl');
    const en = langOf(section, 'en');

    expect(section.languages.map((entry) => entry.lang)).toEqual(['pl', 'en']);
    expect(ids(pl?.email ?? [])).toEqual(['pl']);
    expect(stockIds(pl?.email[0])).toEqual(['pl-stock']);
    expect(ids(en?.email ?? [])).toEqual(['en']);
    expect(stockIds(en?.email[0])).toEqual(['en-stock']);
  });

  it('shows a stock template when that language has no generic row', () => {
    mockedQuery.mockReturnValue({
      data: [
        row({ id: 'pl', type: 'new_rental_email', channel: 'email' }),
        row({
          id: 'en-stock',
          type: 'new_rental_email',
          channel: 'email',
          lang: 'en',
          forStock: true,
          stockNames: 'Yard',
        }),
      ],
      isPending: false,
    });

    const { result } = renderHook(() => useTemplateSections());
    const english = langOf(result.current.sections[0], 'en')?.email[0];

    expect(english?.generic.isDefault).toBe(true);
    expect(english?.generic.lang).toBe('en');
    expect(stockIds(english)).toEqual(['en-stock']);
  });
});
