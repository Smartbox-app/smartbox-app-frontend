import { useQuery } from '@tanstack/react-query';
import { StockList } from 'smartbox-types';
import ApiService from '../../services/api-service';

export const stockListQueryKey = ['stock', 'list'] as const;

export const fetchStockList = () =>
  ApiService.callFetch<StockList[]>('GET', 'stock/list');

export const useGetStockListQuery = (enabled = true) =>
  useQuery({
    queryKey: stockListQueryKey,
    queryFn: fetchStockList,
    enabled,
    gcTime: 300000,
    retry: false,
  });
