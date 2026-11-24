import {
  useBoxGroupForOrderQuery,
  useStockForOrderQuery,
} from 'src/queries';

export const useOrderSelection = (stockId?: string, boxGroupId?: string) => {
  const stockQuery = useStockForOrderQuery(stockId);
  const groupQuery = useBoxGroupForOrderQuery(boxGroupId);
  const boxGroup =
    groupQuery.data && groupQuery.data.stockId === stockId
      ? groupQuery.data
      : undefined;
  const requested = !!stockId && !!boxGroupId;
  const pending = requested && (stockQuery.isPending || groupQuery.isPending);
  const failed =
    requested &&
    !pending &&
    (stockQuery.isError || groupQuery.isError || !boxGroup);

  return {
    stock: stockQuery.data,
    boxGroup,
    pending,
    failed,
  };
};
