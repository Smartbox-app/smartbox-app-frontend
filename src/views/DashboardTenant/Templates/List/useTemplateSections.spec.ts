import type { TemplateChannelGroup, TemplateSectionRow } from './types';

jest.mock('src/queries', () => ({
  useTemplateListQuery: jest.fn(),
}));

import { renderHook } from '@testing-library/react';
import { useTemplateListQuery } from 'src/queries';
import { useTemplateSections } from './useTemplateSections';

const mockedQuery = useTemplateListQuery as jest.Mock;

const row = (overrides: {
  id: string;
  type: string;
  channel: 'email' | 'sms';
  forStock?: boolean;
  stockNames?: string;
}) => ({
  stockNames: '',
  forStock: false,
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
});
