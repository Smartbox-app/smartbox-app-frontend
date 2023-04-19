// import { JSEncrypt } from 'JSEncrypt';
import * as JsEncryptModule from 'jsencrypt';
/* tslint:disable:max-line-length */
const PUBLIC_KEY =
  'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0NCk1JR2ZNQTBHQ1NxR1NJYjNEUUVCQVFVQUE0R05BRENCaVFLQmdRQ0V5NkZWY0lnaGw5YTcxSmwwTjZMdTJoNVcNCktpeE9lemRDU1FHVE9lT2JJdWx6QjhzSDQxbnpUSWN1OVlpMGNHYmJ1UC9IeUlmS2Mrd2NVRHhuajhQU0l0U0UNCnNWMVlnVjdDdkc1WDIzMzdSRWlZajh0K0Qxc2ZlL1lNYlNrNWpvWDNkTjA4cDZFRnREUlV2aWM1L3RscG55c3gNCnJ3NDIwWDZHaFp3WkZvcjdvd0lEQVFBQg0KLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0t';

export const encryptMessage = (message) => {
  const encrypt = new JsEncryptModule.JSEncrypt();

  return encrypt.encrypt('RSA', PUBLIC_KEY, message);
};

// export const asyncEncryptMessage = (message: string) => async () =>
//   new Promise(async (resolve ) => {
//     return encryptMessage(message);
//   });
