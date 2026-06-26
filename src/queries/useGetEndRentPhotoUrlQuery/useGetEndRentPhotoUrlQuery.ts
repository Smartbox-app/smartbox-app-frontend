import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  endRentPhotoUrlQueryKey,
  fetchEndRentPhotoDownloadUrl,
  loadEndRentPhotoDisplayUrl,
} from './end-rent-photo-url';

export const useGetEndRentPhotoUrlQuery = (rentId?: string) => {
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);

  const query = useQuery({
    enabled: !!rentId,
    queryKey: rentId
      ? endRentPhotoUrlQueryKey(rentId)
      : ['rent', 'end-photo-url', 'missing'],
    queryFn: async () => {
      if (!rentId) return null;

      const data = await fetchEndRentPhotoDownloadUrl(rentId);
      if (!data?.url) {
        throw new Error('end_rent_photo_not_found');
      }

      return data;
    },
    retry: false,
    staleTime: 50 * 60 * 1000,
  });

  useEffect(() => {
    setDisplayUrl(null);

    if (!query.data?.url) {
      return;
    }

    let objectUrl: string | null = null;
    let cancelled = false;

    const load = async () => {
      try {
        const resolvedUrl = await loadEndRentPhotoDisplayUrl(query.data);
        if (cancelled) {
          if (resolvedUrl.startsWith('blob:')) {
            URL.revokeObjectURL(resolvedUrl);
          }
          return;
        }

        objectUrl = resolvedUrl.startsWith('blob:') ? resolvedUrl : null;
        setDisplayUrl(resolvedUrl);
      } catch {
        if (!cancelled) setDisplayUrl(null);
      }
    };

    void load();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [query.data]);

  return {
    ...query,
    displayUrl,
  };
};
