import { AuthLoginRequest, AuthLoginResult, UserRes } from "smartbox-types";
import ApiService from "../services/api-service";
import { notifications, order } from "../actions";
import { history } from "../App";
import { hideModal } from "./modal";
import {
  getRememberedRedirect,
  clearRememberedRedirect,
} from "../utils/remeber-redirect";

export const saveUser = (userData: AuthLoginResult) => ({
  type: "LOGIN_SUCCESS",
  payload: userData,
});

export const loginWithGoogle = () => async (dispatch: any) => {
  await ApiService.post(
    dispatch,
    "LOGIN_SUCCESS",
    "LOGIN_WITH_GOOGLE_FAILED",
    null,
    null,
    "auth/login-google",
    "LOADING",
    {}
  );
};

export const login = (userData: AuthLoginRequest) => async (dispatch: any) => {
  await ApiService.post(
    dispatch,
    "LOGIN_SUCCESS",
    "LOGIN_FAILED",
    (response: AuthLoginResult) => {
      dispatch(notifications.successNotification("notification.logInSuccess"));
      dispatch({ type: "REFRESH_API_TABLE" });
      dispatch({ type: "REFRESH_API_GRID" });
      dispatch(hideModal());

      const redirect = getRememberedRedirect();

      if (redirect && redirect.role === response.role) {
        history.push(redirect.to);
        clearRememberedRedirect();
      }
    },
    null,
    "auth/login",
    "LOGIN_LOADING",
    userData
  );
};

export const clearUserSession = () => ({ type: "CLEAR_USER_SESSION" });

export const getUserLoginGoogleData = () => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    "LOGIN_SUCCESS",
    "LOGIN_WITH_Google_FAILED",
    null,
    null,
    "auth/login-google/redirect"
  );
};

export const emailVerification =
  (userId: string, updateToken: string) => async (dispatch: any) => {
    await ApiService.post(
      dispatch,
      "EMAIL_VERIFICATION_SUCCESS",
      "EMAIL_VERIFICATION_FAILED",
      () => {
        dispatch(
          notifications.successNotification(
            "notification.useEmailVerificationSuccess"
          )
        );
        history.push("/");
      },
      null,
      `user/active/${userId}/${updateToken}`,
      "LOADING",
      {}
    );
  };

export const emailVerificationResendMail = () => async (dispatch: any) => {
  await ApiService.post(
    dispatch,
    "EMAIL_VERIFICATION_RESEND_MAIL_SUCCESS",
    "EMAIL_VERIFICATION_RESEND_MAIL_FAILED",
    null,
    null,
    "user/resend-active-email",
    "LOADING",
    {}
  );
};

export const authGmailUser = (googleToken: string) => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    "LOGIN_SUCCESS",
    "EMAIL_VERIFICATION_RESEND_MAIL_FAILED",
    (response: { user: UserRes }) => {
      dispatch(notifications.successNotification("notification.logInSuccess"));
      history.push("/");
    },
    null,
    `auth/login-by-google-token/${googleToken}}`,
    "LOADING"
  );
};
