const NAME_I18N_LANGS = ['cz', 'ua', 'de', 'en'] as const;

/** Append flat translated name fields (`name_en`, …) from form values into FormData. */
export const appendNameI18nFields = (
  formData: FormData,
  values: Record<string, unknown>,
) => {
  for (const lang of NAME_I18N_LANGS) {
    const key = `name_${lang}`;
    const value = values[key];
    if (typeof value === 'string') formData.append(key, value);
  }
};

/** Scalar fields plus translated names. Skips `name_*` so they are appended once. */
export const formDataWithNameI18n = (values: Record<string, unknown>) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (key.startsWith('name_')) continue;
    if (value == null || value === '') continue;
    if (value instanceof File) {
      formData.append(key, value, value.name);
      continue;
    }
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      formData.append(key, String(value));
    }
  }
  appendNameI18nFields(formData, values);
  return formData;
};
