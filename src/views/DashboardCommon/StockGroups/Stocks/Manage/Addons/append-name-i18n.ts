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
