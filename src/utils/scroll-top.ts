export const scrollTop = () => {
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
};

export const scrollToElement = (element: HTMLElement | Element | null) => {
  if (!element) return;
  setTimeout(() => {
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - 200,
      behavior: 'smooth',
    });
  });
};
