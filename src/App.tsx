import { App as CapacitorApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { QueryClientProvider } from '@tanstack/react-query';
import countries from 'i18n-iso-countries';
import cs from 'i18n-iso-countries/langs/cs.json';
import de from 'i18n-iso-countries/langs/de.json';
import en from 'i18n-iso-countries/langs/en.json';
import pl from 'i18n-iso-countries/langs/pl.json';
import uk from 'i18n-iso-countries/langs/uk.json';
import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { Route, Router, Switch, Redirect } from 'react-router-dom';
import ReactSelect from 'react-select';
import 'reflect-metadata';

import { appStatus } from 'src/actions/app-status';
import { AppGlobalStyles } from 'src/AppGlobalStyles';
import AppOffline from 'src/components/AppOffline';
import { AppWrapper } from 'src/components/AppWrapper';
import {
  OnlineContent,
  OfflineContent,
  // UpdateInfoBar,
  RouteAdmin,
  RouteUser,
  RouteWorker,
  Modal,
  ErrorBoundary,
  Cookies,
  RouteTenant,
} from 'src/components/Common';
import BannerAndroid from 'src/components/Common/BannerAndroid';
import BannerIos from 'src/components/Common/BanneriOS';
import { RouteGuest } from 'src/components/Common/RouteGuest';
import { UnauthorizedRoute } from 'src/components/Layout';
import { NotificationContainer } from 'src/components/Notifications';
import { TenantInactiveScreen } from 'src/components/TenantInactiveScreen';
import { history } from 'src/history';
import { applyFlatpickrLocale } from 'src/i18n/flatpickr-locale';
import { CustomThemeProvider } from 'src/providers';
import { queryClient } from 'src/query-client';
import { store } from 'src/store';
import type { AppDispatch } from 'src/types/app-dispatch';
import { Page404, Welcome } from 'src/views';
import { PaymentResult } from 'src/views/DashboardCommon';
import { PrivacyPolicy } from 'src/views/PrivacyPolicy';
import { Rules } from 'src/views/Rules';

import 'flatpickr/dist/flatpickr.min.css';

const EmailConfirm = React.lazy(() => import('src/views/Auth/EmailConfirm'));
const Login = React.lazy(() =>
  import('src/views/Auth/Login').then((module) => ({ default: module.Login })),
);
const Register = React.lazy(() => import('src/views/Auth/Register'));
const RestorePass = React.lazy(() => import('src/views/Auth/RestorePass'));
const UserActivation = React.lazy(() => import('src/views/Auth/UserActivation'));
const EmailSend = React.lazy(() => import('src/views/Auth/EmailSend'));

const TenantActivation = React.lazy(
  () => import('src/views/Auth/TenantActivation'),
);
const ResendActivationLink = React.lazy(
  () => import('src/views/Auth/ResendActivationLink'),
);
const ActivateAccount = React.lazy(
  () => import('src/views/Auth/ActivateAccount'),
);

const DashboardAdmin = React.lazy(() => import('src/views/DashboardAdmin'));
const DashboardUser = React.lazy(() => import('src/views/DashboardUser'));
const DashboardTenant = React.lazy(() => import('src/views/DashboardTenant'));
const DashboardWorker = React.lazy(() => import('src/views/DashboardWorker'));

applyFlatpickrLocale();

countries.registerLocale(pl);
countries.registerLocale(en);
countries.registerLocale(cs);
countries.registerLocale(uk);
countries.registerLocale(de);

CapacitorApp.addListener('appUrlOpen', async ({ url }) => {
  try {
    const parsed = new URL(url);

    // If your app is hosted at https://my-app.com
    const path = parsed.pathname + parsed.search + parsed.hash;

    history.push(path);
  } finally {
    try {
      await Browser.close();
    } catch {
      // Ignore if Browser wasn't opened or can't be closed
    }
  }
});



const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Router history={history}>
          <CustomThemeProvider>
            <AppWrapper>
              <AppGlobalStyles />
              <OnlineContent>
                {/* <UpdateInfoBar /> */}
                <NotificationContainer />
  
                {/* <AppMessage /> */}
                <ErrorBoundary>
                  <Suspense>
                    <Switch>
                      <RouteAdmin path="/admin" component={DashboardAdmin} />
                      <RouteWorker path="/worker" component={DashboardWorker} />
                      <RouteUser path="/user" component={DashboardUser} />
                      <RouteTenant path="/client" component={DashboardTenant} />
                      <UnauthorizedRoute>
                        <Switch>
                          <Route
                            exact
                            path="/inactive"
                            component={TenantInactiveScreen}
                          />
                          <Route
                            exact
                            path="/"
                            render={({ location }) => (
                              <Redirect
                                to={`/login${location.search || ''}${location.hash || ''}`}
                              />
                            )}
                          />
                          <RouteGuest path="/welcome" component={Welcome} />
                          <RouteGuest path="/login" component={Login} />
                          <RouteGuest
                            exact
                            path="/register"
                            component={Register}
                          />
                          <RouteGuest
                            path="/register/mail-was-send"
                            component={EmailSend}
                          />
                          <RouteGuest
                            exact
                            path="/restore-pass"
                            component={RestorePass}
                          />
                          <RouteGuest
                            path="/restore-pass/:userId/:updateToken"
                            component={RestorePass}
                          />
                          <RouteGuest
                            path="/resend-activation-link"
                            component={ResendActivationLink}
                          />
                          <RouteGuest
                            path="/activate-account"
                            component={ActivateAccount}
                          />
                          <RouteGuest
                            path="/user-activation/:invitationId/:updateToken"
                            component={UserActivation}
                          />
                          <RouteGuest
                            path="/tenant-activation/:userId/:updateToken"
                            component={TenantActivation}
                          />
                          <RouteGuest
                            path="/join-from-invitation/:invitationId/:updateToken"
                            component={UserActivation}
                          />
                          <RouteGuest
                            exact
                            path="/email-confirmation/:userId/:updateToken"
                            component={EmailConfirm}
                          />
                          <Route
                            path="/payment/:id"
                            render={() => <PaymentResult />}
                          />
                          <Route
                            path="/payment-success/"
                            render={() => <PaymentResult />}
                          />
                          <Route
                            path="/payment-failed/"
                            render={() => <PaymentResult />}
                          />
                          <Route
                            path="/payment-pending/"
                            render={() => <PaymentResult />}
                          />
                          <Route
                            path="/payment-error/"
                            render={() => <PaymentResult />}
                          />
                          <Route exact path="/rules" component={Rules} />
                          <Route
                            exact
                            path="/privacy-policy"
                            component={PrivacyPolicy}
                          />
                          <Route exact path="/404" component={Page404} />
                          <Route component={Page404} />
                        </Switch>
                      </UnauthorizedRoute>
                    </Switch>
                  </Suspense>
                </ErrorBoundary>

                {!Capacitor.isNativePlatform() ? (
                  <>
                    <BannerAndroid />
                    <BannerIos />
                    <Cookies />
                  </>
                ) : null}
                <Modal />
              </OnlineContent>
              <OfflineContent>
                <AppOffline />
              </OfflineContent>
            </AppWrapper>
          </CustomThemeProvider>
        </Router>
      </Provider>
    </QueryClientProvider>
  );
};

const listenToWindowEvent =
  (name: string, mapEventToAction: (event: Event) => { type: string }) =>
  (dispatch: AppDispatch) => {
    const handleEvent = (event: Event) => {
      dispatch(mapEventToAction(event));
    };
    window.addEventListener(name, handleEvent);
  };

store.dispatch(listenToWindowEvent('offline', appStatus));

store.dispatch(listenToWindowEvent('online', appStatus));

store.dispatch(
  appStatus({ type: window.navigator.onLine ? 'online' : 'offline' }),
);

export { ReactSelect };
export { store } from 'src/store';
export default App;
