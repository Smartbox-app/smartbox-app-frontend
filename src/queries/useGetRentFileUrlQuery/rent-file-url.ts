import { RentFileDownloadUrlRes } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const fetchRentFileDownloadUrl = (rentId: string, fileName: string) =>
  ApiService.callFetch<RentFileDownloadUrlRes>(
    'GET',
    `rent/file/${rentId}/${encodeURIComponent(fileName)}/url`,
    undefined,
    undefined,
    undefined,
    false,
    true,
  );
