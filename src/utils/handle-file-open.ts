import { DownloadService } from 'src/services/download-service';

export const handleFileOpen = async (
  url: string,
  filename?: string,
): Promise<void> => {
  await DownloadService.download(url, undefined, filename);
};
