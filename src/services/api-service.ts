import { ApiErrorCode, ApiResult } from 'smartbox-types';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { notifications } from '../actions';
import { store, history } from '../App';
import { Preferences } from '@capacitor/preferences';

const getUrl = async () => {
  return typeof import.meta.env.VITE_APP_API_URL === 'string'
    ? `${import.meta.env.VITE_APP_API_URL.trim()}/`
    : 'http://localhost:3001/';
};

export default class ApiService {
  static url = '';

  static setUrl = async () => {
    this.url = await getUrl();
  };

  static wrapUrlWithTenant = (url: string) => {
    const tenantIdentifier = store.getState().tenant?.identifier;

    if (!tenantIdentifier) return url;

    if (url.includes('?')) return `${url}&tenantId=${tenantIdentifier}`;
    return `${url}?tenantId=${tenantIdentifier}`;
  };

  static call = async (
    dispatch: any,
    method: string,
    successAction: string,
    failedAction: string,
    successCb: any,
    failedCb: any,
    url: string,
    loadingAction = 'LOADING',
    requestData?: any,
  ) => {
    dispatch({ type: loadingAction, payload: true });

    const headers: {
      [key: string]: string;
    } = {
      'Content-Type': 'application/json',
    };

    if (Capacitor.isNativePlatform()) {
      const token = await Preferences.get({ key: 'smst_token' });
      headers.Authorization = `Bearer ${token.value}`;
    }

    const wrappedUrl = ApiService.wrapUrlWithTenant(url);

    try {
      const response = await fetch(`${ApiService.url}${wrappedUrl}`, {
        method,
        headers: requestData && requestData instanceof FormData ? {} : headers,
        credentials: 'include',
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
    } catch (error) {
      dispatch(notifications.errorNotification(ApiErrorCode.OtherError));
      dispatch({ type: failedAction, payload: ApiErrorCode.OtherError });
      // if (SessionService.isUserSet()) dispatch(auth.clearUserSession());
      // dispatch({ type: loadingAction, payload: false });
      // history.push('/404');
    }
  };

  static callFetch = async <R>(
    method: string,
    url: string,
    successCb?: any,
    failedCb?: any,
    requestData?: any,
    throwError?: boolean,
    muteNotification?: boolean,
  ) => {
    const headers: {
      [key: string]: string;
    } = {
      'Content-Type': 'application/json',
    };

    console.log('CALLING FETCH', url);

    if (Capacitor.isNativePlatform()) {
      const token = await Preferences.get({ key: 'smst_token' });
      headers.Authorization = `Bearer ${token.value}`;
    }

    const wrappedUrl = ApiService.wrapUrlWithTenant(url);
    try {
      const response = await fetch(`${ApiService.url}${wrappedUrl}`, {
        method,
        headers: requestData && requestData instanceof FormData ? {} : headers,
        credentials: 'include',
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
            //
          } else {
            if (!muteNotification)
              store.dispatch(notifications.errorNotification(data.error_code));
          }
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

    const wrappedUrl = ApiService.wrapUrlWithTenant(url);

    const response = await fetch(wrappedUrl, {
      method,
      headers,
      credentials: 'include',
    });

    return response;
  };

  static loadForm = async (url: string) => {
    return JSON.parse(((await ApiService.callFetch('GET', url)) as any).form);
  };

  static sendForm = async (
    url: string,
    values: any,
    method = 'POST',
    successCb?: any,
    failedCb?: any,
  ): Promise<any | void> => {
    return new Promise(async (resolve, reject) => {
      await ApiService.callFetch(
        method,
        url,
        (payload: any) => {
          if (successCb) successCb(payload);

          resolve(payload);
        },
        (data: any) => {
          if (data.form_errors) {
            resolve(data);
          } else {
            if (failedCb) failedCb(data);
            reject(data.result);
          }
        },
        values,
      );
    });
  };

  static is401 = (response: any) => response.statusCode === 401;

  static is404 = (response: any) => response.statusCode === 404;

  static is502 = (response: any) => response.statusCode === 502;

  static post = async (
    dispatch: any,
    successAction: string,
    failedAction: string,
    successCb: any,
    failedCb: any,
    url: string,
    loadingAction = 'LOADING',
    requestData: any,
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

  static patch = async (
    dispatch: any,
    successAction: string,
    failedAction: string,
    successCb: any,
    failedCb: any,
    url: string,
    loadingAction = 'LOADING',
    requestData?: any,
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

  static get = async (
    dispatch: any,
    successAction: string,
    failedAction: string,
    successCb: any,
    failedCb: any,
    url: string,
    loadingAction = 'LOADING',
    requestData?: any,
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

  static delete = async (
    dispatch: any,
    successAction: string,
    failedAction: string,
    successCb: any,
    failedCb: any,
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
    data?: any,
    excludeApiURL = false,
  ): Promise<{ filename: string; data: string }> => {
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

    const capacitorMethod = data ? CapacitorHttp.post : CapacitorHttp.get;

    try {
      const response = await capacitorMethod({
        headers,
        url: excludeApiURL ? url : `${ApiService.url}${url}`,
        responseType: 'blob',
        data: data ? data : undefined,
        webFetchExtra: {
          credentials: 'include',
        },
      });
      const received = response.data;
      const filename =
        response.headers['Filename'] || response.headers['filename'];

      return { filename, data: received };
    } catch (e) {
      throw e;
    }
  };
}
