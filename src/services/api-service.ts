import type { AppDispatch } from 'src/types/app-dispatch';
import { ApiErrorCode, ApiResult } from 'smartbox-types';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import * as notifications from '../actions/notifications';
import { store } from '../store';
import { history } from '../history';
import { Preferences } from '@capacitor/preferences';

import { getApiBaseUrl } from '../config/api-url';

import { getCachedTenant } from '../queries/useGetTenantQuery/tenant-query';
import { currentAppLanguage } from '../i18n/app-language';

const getUrl = async () => getApiBaseUrl();

type SuccessHandler<T> = {
  (payload: T): void;
} | null;
type ErrorBody = {
  form_errors?: unknown;
  result?: unknown;
  statusCode?: number;
  error_code?: string;
  payload?: unknown;
};
type ErrorHandler = {
  (data: ErrorBody): boolean | void;
} | null;
type StatusBody = { statusCode?: number };

const handleUnauthorized = async () => {
  // queryClient.setQueryData(['my-details'], null);
  // queryClient.invalidateQueries({ queryKey: ['tenant'] });
  // store.dispatch(clearUserSession());
  // store.dispatch(order.clearOrder());
  // if (Capacitor.isNativePlatform()) {
  //   await Preferences.clear();
  // }
};

export default class ApiService {
  static url = '';

  static setUrl = async () => {
    this.url = await getUrl();
  };

  static withLanguage = (headers: { [key: string]: string }) => {
    headers.lang = currentAppLanguage();
    return headers;
  };

  static wrapUrlWithTenant = (url: string) => {
    const tenantIdentifier = getCachedTenant()?.identifier;

    if (!tenantIdentifier) return url;

    if (url.includes('?')) return `${url}&tenantId=${tenantIdentifier}`;
    return `${url}?tenantId=${tenantIdentifier}`;
  };

  static call = async <R = unknown>(
    dispatch: AppDispatch,
    method: string,
    successAction: string,
    failedAction: string,
    successCb: SuccessHandler<R>,
    failedCb: ErrorHandler,
    url: string,
    loadingAction = 'LOADING',
    requestData?: object,
  ) => {
    dispatch({ type: loadingAction, payload: true });

    const headers: {
      [key: string]: string;
    } =
      requestData && requestData instanceof FormData
        ? {}
        : {
            'Content-Type': 'application/json',
          };

    if (Capacitor.isNativePlatform()) {
      const token = await Preferences.get({ key: 'smst_token' });
      headers.Authorization = `Bearer ${token.value}`;
    }
    ApiService.withLanguage(headers);

    const wrappedUrl = ApiService.wrapUrlWithTenant(url);

    try {
      const response = await fetch(`${ApiService.url}${wrappedUrl}`, {
        method,
        headers,
        credentials: !Capacitor.isNativePlatform() ? 'include' : undefined,
        body:
          requestData && requestData instanceof FormData
            ? requestData
            : JSON.stringify(requestData),
      });

      const data = await response.json();

      switch (data.result) {
        case ApiResult.ok:
          dispatch({ type: successAction, payload: data.payload });
          if (successCb) successCb(data.payload);
          setTimeout(
            () => dispatch({ type: loadingAction, payload: false }),
            200,
          );
          break;
        case ApiResult.error:
          // @TODO: optional 404 handling
          if (data.error_code === ApiErrorCode.NoSuchObjectWithThisId) {
            history.push('/');
          } else {
            dispatch({ type: failedAction, payload: data.result });
            const errorHandled = failedCb ? failedCb(data) === true : false;
            if (!errorHandled) {
              dispatch(notifications.errorNotification(data.error_code));
            }
            setTimeout(
              () => dispatch({ type: loadingAction, payload: false }),
              200,
            );
          }
          break;
        default:
          if (ApiService.is404(data)) {
            history.push('/');
          } else if (ApiService.is401(data)) {
            await handleUnauthorized();
            setTimeout(
              () => dispatch({ type: loadingAction, payload: false }),
              200,
            );
          } else if (ApiService.is502(data)) {
            history.push('/');
          } else {
            dispatch({ type: failedAction, payload: ApiErrorCode.OtherError });
            dispatch(notifications.errorNotification(ApiErrorCode.OtherError));
            setTimeout(
              () => dispatch({ type: loadingAction, payload: false }),
              200,
            );
          }
      }
    } catch {
      dispatch(notifications.errorNotification(ApiErrorCode.OtherError));
      dispatch({ type: failedAction, payload: ApiErrorCode.OtherError });
      // if (SessionService.isUserSet()) dispatch(auth.clearUserSession());
      // dispatch({ type: loadingAction, payload: false });
      // history.push('/404');
    }
  };

  static callFetch = async <R = unknown>(
    method: string,
    url: string,
    successCb?: ((payload: R) => void) | null,
    failedCb?: ((data: ErrorBody) => boolean | void) | null,
    requestData?: object,
    throwError?: boolean,
    muteNotification?: boolean,
  ) => {

    const headers: {
      [key: string]: string;
    } =
      requestData && requestData instanceof FormData
        ? {}
        : {
            'Content-Type': 'application/json',
          };
    if (Capacitor.isNativePlatform()) {
      const token = await Preferences.get({ key: 'smst_token' });
      headers.Authorization = `Bearer ${token.value}`;
    }
    ApiService.withLanguage(headers);

    const wrappedUrl = ApiService.wrapUrlWithTenant(url);
    try {
      const response = await fetch(`${ApiService.url}${wrappedUrl}`, {
        method,
        headers,
        credentials: !Capacitor.isNativePlatform() ? 'include' : undefined,
        body:
          requestData && requestData instanceof FormData
            ? requestData
            : JSON.stringify(requestData),
      });

      const data = await response.json();

      switch (data.result) {
        case ApiResult.ok:
          if (successCb) successCb(data.payload);
          return data.payload as R;
        case ApiResult.error:
          if (failedCb) failedCb(data);
          if (!muteNotification)
            store.dispatch(notifications.errorNotification(data.error_code));
          if (throwError) throw new Error(data.error_code);
          break;
        default:
          if (ApiService.is401(data)) {
            await handleUnauthorized();
          } else if (!muteNotification)
              store.dispatch(notifications.errorNotification(data.error_code));
      }
    } catch (error) {
      if (!muteNotification && !throwError)
        store.dispatch(
          notifications.errorNotification(ApiErrorCode.OtherError),
        );
      if (throwError) throw error;
    }
  };

  static simpleFetch = async (method: string, url: string) => {
    const headers: {
      [key: string]: string;
    } = {
      'Content-Type': 'application/json',
    };

    if (Capacitor.isNativePlatform()) {
      const token = await Preferences.get({ key: 'smst_token' });
      headers.Authorization = `Bearer ${token.value}`;
    }
    ApiService.withLanguage(headers);

    const wrappedUrl = ApiService.wrapUrlWithTenant(url);

    const response = await fetch(wrappedUrl, {
      method,
      headers,
      credentials: !Capacitor.isNativePlatform() ? 'include' : undefined,
    });

    return response;
  };

  static loadForm = async (url: string) => {
    const payload = await ApiService.callFetch<{ form: string }>('GET', url);
    if (!payload) return {};
    return JSON.parse(payload.form);
  };

  static sendForm = (
    url: string,
    values: object,
    method = 'POST',
    successCb?: (payload: unknown) => void,
    failedCb?: (data: ErrorBody) => void,
  ): Promise<void> => {
    return new Promise<unknown>((resolve, reject) => {
      void ApiService.callFetch(
        method,
        url,
        (payload: unknown) => {
          if (successCb) successCb(payload);

          resolve(payload);
        },
        (data: ErrorBody) => {
          if (data.form_errors) {
            resolve(data);
          } else {
            if (failedCb) failedCb(data);
            reject(data.result);
          }
        },
        values,
      ).catch(reject);
    }) as Promise<void>;
  };

  static is401 = (response: StatusBody) => response.statusCode === 401;

  static is404 = (response: StatusBody) => response.statusCode === 404;

  static is502 = (response: StatusBody) => response.statusCode === 502;

  static post = async <R = unknown>(
    dispatch: AppDispatch,
    successAction: string,
    failedAction: string,
    successCb: SuccessHandler<R>,
    failedCb: ErrorHandler,
    url: string,
    loadingAction = 'LOADING',
    requestData: object,
  ) => {
    await ApiService.call(
      dispatch,
      'POST',
      successAction,
      failedAction,
      successCb,
      failedCb,
      url,
      loadingAction,
      requestData,
    );
  };

  static patch = async <R = unknown>(
    dispatch: AppDispatch,
    successAction: string,
    failedAction: string,
    successCb: SuccessHandler<R>,
    failedCb: ErrorHandler,
    url: string,
    loadingAction = 'LOADING',
    requestData?: object,
  ) => {
    await ApiService.call(
      dispatch,
      'PATCH',
      successAction,
      failedAction,
      successCb,
      failedCb,
      url,
      loadingAction,
      requestData,
    );
  };

  static get = async <R = unknown>(
    dispatch: AppDispatch,
    successAction: string,
    failedAction: string,
    successCb: SuccessHandler<R>,
    failedCb: ErrorHandler,
    url: string,
    loadingAction = 'LOADING',
    requestData?: object,
  ) => {
    await ApiService.call(
      dispatch,
      'GET',
      successAction,
      failedAction,
      successCb,
      failedCb,
      url,
      loadingAction,
      requestData,
    );
  };

  static delete = async <R = unknown>(
    dispatch: AppDispatch,
    successAction: string,
    failedAction: string,
    successCb: SuccessHandler<R>,
    failedCb: ErrorHandler,
    url: string,
    loadingAction = 'LOADING',
  ) => {
    await ApiService.call(
      dispatch,
      'DELETE',
      successAction,
      failedAction,
      successCb,
      failedCb,
      url,
      loadingAction,
    );
  };

  static sendForFile = async (
    method: string,
    url: string,
    data?: object,
    excludeApiURL = false,
  ): Promise<{ filename: string; data: string; contentType?: string }> => {
    const headers: {
      [key: string]: string;
    } = {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    };

    if (Capacitor.isNativePlatform()) {
      const token = await Preferences.get({ key: 'smst_token' });
      headers.Authorization = `Bearer ${token.value}`;
    }
    ApiService.withLanguage(headers);

    const capacitorMethod = data ? CapacitorHttp.post : CapacitorHttp.get;

    const wrappedUrl = excludeApiURL
      ? url
      : `${ApiService.url}${ApiService.wrapUrlWithTenant(url)}`;

    const response = await capacitorMethod({
      headers,
      url: wrappedUrl,
      responseType: 'blob',
      data: data ? data : undefined,
      webFetchExtra: {
        credentials: !Capacitor.isNativePlatform() ? 'include' : undefined,
      },
    });
    const received = response.data;

    const filename =
      response.headers['Filename'] || response.headers['filename'];

    return {
      filename,
      data: received,
      contentType: response.headers['Content-Type'] || response.headers['content-type'],
    };
  };
}
