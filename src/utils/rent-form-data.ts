import { format } from 'date-fns';

export const appendCollectionFields = (
  formData: FormData,
  collection: Record<string, unknown>,
) => {
  for (const key of Object.keys(collection)) {
    const value = collection[key];
    if (value == null || value === '') continue;

    if (value instanceof Date) {
      formData.append(key, format(value, 'yyyy-MM-dd'));
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  }

  return formData;
};

export const appendAddonFiles = (
  formData: FormData,
  orderAddons: Record<string, { file: File | null }>,
) => {
  for (const addonId of Object.keys(orderAddons)) {
    const file = orderAddons[addonId]?.file;
    if (!file) continue;

    formData.append('addonFiles', file, `${addonId}--${file.name}`);
  }

  return formData;
};
