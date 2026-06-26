import { EndRentPhotoDownloadUrlRes } from 'smartbox-types';
import ApiService from 'src/services/api-service';
import { loadSignedDownloadUrl } from 'src/utils/signed-download-url';

export const endRentPhotoUrlQueryKey = (rentId: string) =>
  ['rent', 'end-photo-url', rentId] as const;

export const fetchEndRentPhotoDownloadUrl = (rentId: string) =>
  ApiService.callFetch<EndRentPhotoDownloadUrlRes>(
    'GET',
    `rent/end-photo/${rentId}`,
    undefined,
    undefined,
    undefined,
    false,
    true,
  );

export const loadEndRentPhotoDisplayUrl = (
  downloadUrl: EndRentPhotoDownloadUrlRes,
) => loadSignedDownloadUrl(downloadUrl);
