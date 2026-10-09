import { PeriodEntity, RentDescription } from 'smartbox-types';
import {
  hasViewableAgreementPeriod,
  resolveRentAgreementForDescriptionLine,
} from './rent-agreement';

const line = (overrides: Partial<RentDescription> = {}): RentDescription =>
  ({
    startAt: new Date(2026, 9, 1),
    finishAt: new Date(2026, 9, 31),
    agreement: 'legacy text',
    documentId: null,
    ...overrides,
  }) as RentDescription;

const period = (overrides: Partial<PeriodEntity> = {}): PeriodEntity =>
  ({
    startAt: new Date(2026, 9, 1),
    finishAt: new Date(2026, 9, 31),
    agreementDocumentId: 'doc-1',
    ...overrides,
  }) as PeriodEntity;

describe('resolveRentAgreementForDescriptionLine', () => {
  it('keeps the document already stored on the description line', () => {
    expect(
      resolveRentAgreementForDescriptionLine(
        line({ documentId: 'line-doc', agreement: 'signed' }),
        [period({ agreementDocumentId: 'other' })],
      ),
    ).toEqual({ documentId: 'line-doc', agreement: 'signed' });
  });

  it('uses a period document that sits inside the description line', () => {
    expect(
      resolveRentAgreementForDescriptionLine(line({ agreement: undefined }), [
        period({
          startAt: new Date(2026, 8, 1),
          agreementDocumentId: 'too-early',
        }),
        period(),
      ]).documentId,
    ).toBe('doc-1');
  });

  it('accepts a period on an open-ended line and rejects one that ends after the line', () => {
    const openLine = line({ finishAt: undefined });
    expect(
      resolveRentAgreementForDescriptionLine(openLine, [
        period({ finishAt: new Date(2027, 0, 1) }),
      ]).documentId,
    ).toBe('doc-1');

    expect(
      resolveRentAgreementForDescriptionLine(line(), [
        period({ finishAt: new Date(2026, 10, 1) }),
      ]).documentId,
    ).toBeNull();
  });
});

describe('hasViewableAgreementPeriod', () => {
  it('is true when either a document or agreement text exists', () => {
    expect(hasViewableAgreementPeriod(line({ agreement: undefined }))).toBe(
      false,
    );
    expect(hasViewableAgreementPeriod(line())).toBe(true);
    expect(
      hasViewableAgreementPeriod(line({ agreement: undefined }), [period()]),
    ).toBe(true);
  });
});
