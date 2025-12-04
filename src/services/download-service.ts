import FileSaver from 'file-saver';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
// import mime from 'mime-types';
// import { Toast } from '@capacitor/toast';
import { FileOpener } from '@capacitor-community/file-opener';
import { __ } from '../helpers/i18n';
import ApiService from './api-service';

export class DownloadService {
  static base64ToBlob(base64: string, type: string): Blob {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    const byteString = atob(base64.includes(',') ? base64.split(',')[1] : base64);

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

  static async download(url: string, payload?: any) {
    const { data: dataBase64, filename } = await ApiService.sendForFile(
      payload ? 'POST' : 'GET',
      url,
      payload,
    );
    console.log('RESULRTTTT', dataBase64, filename);
    const normalizedName = (filename || 'download').replace(/[&\/\\#,+()$~%'":*?<>{} ]/g, '_');
    if (Capacitor.isNativePlatform()) {
      try {
        const writeFileResult = await Filesystem.writeFile({
          path: `${normalizedName}`,
          directory: Directory.Documents,
          recursive: true,
          data: dataBase64,
        });

        console.log('Result File Written', writeFileResult.uri);
        const getUriResult = await Filesystem.getUri({
          directory: Directory.Documents,
          path: `${normalizedName}`,
        });
        // await Toast.show({
        //   text: __('application.fileDownload', { link: getUriResult.uri }),
        // });
        try {
          FileOpener.open({
            filePath: getUriResult.uri,
            // @TODO - handling for download different mime types
            // contentType: mime.lookup(normalizedName) as string,
            contentType: 'text/csv',
            openWithDefault: false
          });
        } catch (e) {
          console.log('Error opening file', e);
        }
      } catch (e) {
        console.log('ERROR', e);
      }
    } else {
      const segments = filename.split('.');
      const type = segments[segments.length - 1];
      FileSaver.saveAs(DownloadService.base64ToBlob(dataBase64, type), normalizedName);
    }
  }
}
