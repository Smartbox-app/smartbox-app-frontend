import {
  buildAddonTemplateVariableOptions,
  normalizeAddonSlug,
} from './addon-template-variables';

describe('addon template variables', () => {
  it('removes spaces from a slug', () => {
    expect(normalizeAddonSlug(' pad lock ')).toBe('padlock');
  });

  it('builds a variant and a price variable for each addon', () => {
    expect(
      buildAddonTemplateVariableOptions([
        { slug: 'pad lock', name: 'Kłódka' },
      ] as never),
    ).toEqual([
      { name: 'padlock.variant', label: 'Kłódka (padlock) – wariant' },
      { name: 'padlock.price', label: 'Kłódka (padlock) – cena' },
    ]);
  });
});
