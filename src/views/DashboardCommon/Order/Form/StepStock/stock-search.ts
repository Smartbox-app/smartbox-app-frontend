import { history } from 'src/history';

export const setStockSearchParam = (stockId: string | null) => {
  const params = new URLSearchParams(history.location.search);
  if (stockId) params.set('stock', stockId);
  else params.delete('stock');

  const query = params.toString();
  history.replace({
    pathname: history.location.pathname,
    search: query ? `?${query}` : '',
  });
};
