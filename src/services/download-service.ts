import { FileOpener } from '@capacitor-community/file-opener';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import FileSaver from 'file-saver';

import ApiService from 'src/services/api-service';

const getMimeFromFilename = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'csv':
      return 'text/csv';
    default:
      return 'application/octet-stream';
  }
};

export class DownloadService {
  static base64ToBlob(base64: string, type: string): Blob {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    const byteString = atob(
      base64.includes(',') ? base64.split(',')[1] : base64,
    );

    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    const ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    const blob = new Blob([ab], { type });
    return blob;
  }

  static async download(url: string, payload?: object, filenameFallback?: string) {
    const {
      data: dataBase64,
      filename,
      contentType,
    } = await ApiService.sendForFile(payload ? 'POST' : 'GET', url, payload);

    let normalizedName = (filename || filenameFallback || 'download').replace(
      /[&/\\#,+()$~%'":*?<>{} ]/g,
      '_',
    );

    const extension = normalizedName.split('.')[1];

    if (!extension && contentType === 'application/pdf') {
      normalizedName = `${normalizedName}.pdf`;
    }

    const mimeType = getMimeFromFilename(normalizedName);

    if (Capacitor.isNativePlatform()) {
      try {
        await Filesystem.writeFile({
          path: `${normalizedName}`,
          directory: Directory.Documents,
          recursive: true,
          data: dataBase64,
        });

        const getUriResult = await Filesystem.getUri({
          directory: Directory.Documents,
          path: `${normalizedName}`,
        });

        try {
          await FileOpener.open({
            filePath: getUriResult.uri,
            contentType: mimeType,
            openWithDefault: true,
          });
        } catch (e) {
          console.error('Error opening file', e);
        }
      } catch (e) {
        console.error('ERROR', e);
      }
    } else {
      FileSaver.saveAs(
        DownloadService.base64ToBlob(dataBase64, mimeType),
        normalizedName,
      );
    }
  }
}
