export const findAncestor = (
  el: Element | null,
  sel: string,
): Element | null => {
  let current = el?.parentElement ?? null;

  while (current) {
    const matcher =
      current.matches?.bind(current) ??
      (
        current as Element & {
          matchesSelector?: (selector: string) => boolean;
        }
      ).matchesSelector?.bind(current);

    if (matcher?.(sel)) return current;
    current = current.parentElement;
  }

  return null;
};
