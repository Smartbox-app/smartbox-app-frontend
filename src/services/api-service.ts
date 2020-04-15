import { ApiErrorCode, ApiResult } from 'application-types';
import { auth, notifications } from '../actions';
import SessionService from './session-service';
import { store, history } from '../App';

export default class ApiService {
  static url = process.env.NODE_ENV === 'production' ? 'prod.address/' : 'test.address/';

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

    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(`${ApiService.url}${url}`, {
        method,
        headers: requestData && requestData instanceof FormData ? {} : headers,
        credentials: 'include',
        body: requestData && requestData instanceof FormData ? requestData : JSON.stringify(requestData),
      });

      const data = await response.json();

      switch (data.result) {
        case ApiResult.ok:
          dispatch({ type: successAction, payload: data.payload });
          if (successCb) successCb(data.payload);
          dispatch({ type: loadingAction, payload: false });
          break;
        case ApiResult.error:
          // @TODO: optional 404 handling
          // if (data.error_code === ApiErrorCode.NoSuchObjectWithThisId) {
          //     history.push('/error');
          // }
          // else {
          dispatch({ type: failedAction, payload: data.result });
          if (failedCb) failedCb();
          dispatch(notifications.errorNotification(data.error_code));
          dispatch({ type: loadingAction, payload: false });
          // }
          break;
        default:
          if (ApiService.is404(data)) {
            history.push('/error');
          } else if (ApiService.is401(data)) {
            if (SessionService.isUserSet()) dispatch(auth.clearUserSession());
            dispatch({ type: loadingAction, payload: false });
          } else if (ApiService.is502(data)) {
            history.push('/error');
          } else {
            dispatch({ type: failedAction, payload: ApiErrorCode.OtherError });
            dispatch(notifications.errorNotification(ApiErrorCode.OtherError));
            dispatch({ type: loadingAction, payload: false });
          }
      }
    } catch (error) {
      dispatch({ type: failedAction, payload: ApiErrorCode.OtherError });
      history.push('/error');
      if (SessionService.isUserSet()) dispatch(auth.clearUserSession());
      dispatch({ type: loadingAction, payload: false });
    }
  };

  static callFetch = async (method: string, url: string, successCb?: any, failedCb?: any, requestData?: any) => {
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(`${ApiService.url}${url}`, {
        method,
        headers: requestData && requestData instanceof FormData ? {} : headers,
        credentials: 'include',
        body: requestData && requestData instanceof FormData ? requestData : JSON.stringify(requestData),
      });

      const data = await response.json();

      switch (data.result) {
        case ApiResult.ok:
          if (successCb) successCb(data.payload);
          return data.payload;
        case ApiResult.error:
          if (failedCb) failedCb(data);
          store.dispatch(notifications.errorNotification(data.error_code));
          break;
        default:
          if (ApiService.is401(data)) {
            if (SessionService.isUserSet()) store.dispatch(auth.clearUserSession());
          } else {
            store.dispatch(notifications.errorNotification(data.error_code));
          }
      }
    } catch (error) {
      store.dispatch(notifications.errorNotification(ApiErrorCode.OtherError));
    }
  };

  static loadForm = async (url: string) => JSON.parse(((await ApiService.callFetch('GET', url)) as any).form);

  static sendForm = async (
    url: string,
    values: any,
    method = 'POST',
    successCb?: any,
    failedCb?: any,
  ): Promise<any | void> =>
    new Promise(async (resolve, reject) => {
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
  ) => {
    await ApiService.call(dispatch, 'GET', successAction, failedAction, successCb, failedCb, url, loadingAction);
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
    await ApiService.call(dispatch, 'DELETE', successAction, failedAction, successCb, failedCb, url, loadingAction);
  };
}
