import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

import { history } from 'src/history';
import ApiService from 'src/services/api-service';

export const getIpgRedirectUrl = (tenantId: string, paymentId: string) => {
  const source = Capacitor.isNativePlatform() ? 'mobile' : 'web';
  return `${ApiService.url}rent/ipg-redirect/${tenantId}/${paymentId}?source=${source}`;
};

export const redirectToIpg = (tenantId: string, paymentId: string) => {
  const url = getIpgRedirectUrl(tenantId, paymentId);

  if (Capacitor.isNativePlatform()) {
    history.push('/');
    Browser.open({ url });
    return;
  }

  window.location.assign(url);
};
