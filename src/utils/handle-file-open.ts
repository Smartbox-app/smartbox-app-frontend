import { DownloadService } from "src/services/download-service";

export const handleFileOpen = async (url: string): Promise<void> => {
  await DownloadService.download(`${url}`);
};
