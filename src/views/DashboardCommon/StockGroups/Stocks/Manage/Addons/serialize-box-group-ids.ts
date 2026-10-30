type FormBoxGroupOption = { value?: string | number | boolean | null };

export const serializeBoxGroupIds = (boxGroupIds: unknown): string => {
  if (!Array.isArray(boxGroupIds)) {
    return JSON.stringify([]);
  }

  const ids = (boxGroupIds as Array<string | FormBoxGroupOption>)
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && item.value != null) {
        return String(item.value);
      }
      return null;
    })
    .filter((id): id is string => typeof id === 'string' && id.length > 0);

  return JSON.stringify(ids);
};
