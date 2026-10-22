import { AddonTemplateVariableRes } from 'smartbox-types';
import { TemplateVariableOption } from './template-variables';

export const normalizeAddonSlug = (slug: string): string =>
  slug.replace(/ /g, '').trim();

export const buildAddonTemplateVariableOptions = (
  addons: AddonTemplateVariableRes[],
  labels: { variant: string; price: string } = {
    variant: 'wariant',
    price: 'cena',
  },
): TemplateVariableOption[] =>
  addons.flatMap((addon) => {
    const slug = normalizeAddonSlug(addon.slug);

    return [
      {
        name: `${slug}.variant`,
        label: `${addon.name} (${slug}) – ${labels.variant}`,
      },
      {
        name: `${slug}.price`,
        label: `${addon.name} (${slug}) – ${labels.price}`,
      },
    ];
  });
