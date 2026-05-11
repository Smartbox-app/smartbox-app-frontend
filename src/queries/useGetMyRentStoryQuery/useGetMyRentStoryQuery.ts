import { useQuery } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { MyRentList, RentStatus } from 'smartbox-types';

function sortRentHistory(items: MyRentList[]): MyRentList[] {
  const active: MyRentList[] = [];
  const other: MyRentList[] = [];
  items.forEach((d) => {
    if (d.status === RentStatus.rented) active.push(d);
    else other.push(d);
  });
  return [...active, ...other];
}

export const useGetMyRentStoryQuery = () => {
  return useQuery({
    queryKey: ['my-rent-story'],
    queryFn: async () => {
      const res = await ApiService.callFetch<MyRentList[]>(
        'GET',
        'rent/story',
        undefined,
        undefined,
        undefined,
        undefined,
        true,
      );
      return sortRentHistory(Array.isArray(res) ? res : []);
    },
    retry: false,
  });
};
