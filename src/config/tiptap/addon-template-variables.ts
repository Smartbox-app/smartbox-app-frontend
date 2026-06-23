import { AddonTemplateVariableRes } from 'smartbox-types';
import { TemplateVariableOption } from './template-variables';

export const normalizeAddonSlug = (slug: string): string =>
  slug.replace(/ /g, '').trim();

export const buildAddonTemplateVariableOptions = (
  addons: AddonTemplateVariableRes[],
): TemplateVariableOption[] =>
  addons.flatMap((addon) => {
    const slug = normalizeAddonSlug(addon.slug);

    return [
      {
        name: `${slug}.variant`,
        label: `${addon.name} (${slug}) – wariant`,
      },
      {
        name: `${slug}.price`,
        label: `${addon.name} (${slug}) – cena`,
      },
    ];
  });
