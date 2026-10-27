import { renderHook } from '@testing-library/react';

import type { TemplateChannelGroup, TemplateSectionRow } from 'src/views/DashboardTenant/Templates/List/types';
import { useTemplateListQuery } from 'src/queries';
import { useTemplateSections } from 'src/views/DashboardTenant/Templates/List/useTemplateSections';

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

describe('useTemplateSections', () => {
  beforeEach(() => {
    mockedQuery.mockReturnValue({ data: [], isPending: false });
  });

  it('groups email and sms that share a label', () => {
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

    expect(result.current.sections).toHaveLength(1);
    expect(result.current.sections[0].label).toBe(
      'Automatyczna płatność zakończona porażką',
    );
    expect(result.current.sections[0].email.map((group: TemplateChannelGroup<TemplateSectionRow>) => group.generic.id)).toEqual([
      'email',
    ]);
    expect(result.current.sections[0].sms[0].stocks.map((stock: TemplateSectionRow) => stock.id)).toEqual([
      'stock',
    ]);
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

    expect(result.current.sections[0].email).toHaveLength(1);
    expect(result.current.sections[0].sms).toHaveLength(0);
  });

  it('keeps stock templates with the language they were saved in', () => {
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
    const email = result.current.sections[0].email;

    expect(email.map((group: TemplateChannelGroup<TemplateSectionRow>) => group.generic.id)).toEqual([
      'pl',
      'en',
    ]);
    expect(email[0].stocks.map((stock: TemplateSectionRow) => stock.id)).toEqual([
      'pl-stock',
    ]);
    expect(email[1].stocks.map((stock: TemplateSectionRow) => stock.id)).toEqual([
      'en-stock',
    ]);
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
    const english = result.current.sections[0].email[1];

    expect(english.generic.isDefault).toBe(true);
    expect(english.generic.lang).toBe('en');
    expect(english.stocks.map((stock: TemplateSectionRow) => stock.id)).toEqual([
      'en-stock',
    ]);
  });
});
