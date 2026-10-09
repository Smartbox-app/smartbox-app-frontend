import {
  agreementTemplateToQueryString,
  buildLegacyAgreementPath,
  buildLegacyAgreementUrl,
} from './agreement-template-query';

describe('agreement template query', () => {
  it('drops empty values and serializes addons', () => {
    const query = agreementTemplateToQueryString({
      firstName: 'Ada',
      lastName: '',
      nip: null,
      area: 4,
      addons: [{ slug: 'lock', price: 10 }],
    });
    const params = new URLSearchParams(query);

    expect(params.get('firstName')).toBe('Ada');
    expect(params.get('lastName')).toBeNull();
    expect(params.get('nip')).toBeNull();
    expect(params.get('area')).toBe('4');
    expect(params.get('addons')).toBe('[{"slug":"lock","price":10}]');
  });

  it('keeps an addon string as-is and omits the query when nothing remains', () => {
    expect(
      agreementTemplateToQueryString({ addons: 'lock:10' }),
    ).toContain('addons=lock');
    expect(buildLegacyAgreementPath('tenant-1', { firstName: '' })).toBe(
      'tenant/agreement/tenant-1',
    );
    expect(
      buildLegacyAgreementUrl('tenant-1', { firstName: 'Ada' }, 'https://api/'),
    ).toBe('https://api/tenant/agreement/tenant-1?firstName=Ada');
  });
});
