import React, { useState, useEffect, Suspense } from 'react';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import ReactSelect from 'react-select';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Route, Router, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import flatpickr from 'flatpickr';
import { Polish } from 'flatpickr/dist/l10n/pl';
import reducers from './reducers';
import { Page404, Welcome } from './views';
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
} from './components/Common';
import { Spinner } from './components/Branded';
import {
  EmailConfirm,
  Login,
  Register,
  RestorePass,
  UserActivation,
  EmailSend,
  GoogleAuth,
  TenantActivation,
  ResendActivationLink,
} from './views/Auth';
import { PaymentResult } from './views/DashboardCommon';
import { NotificationContainer } from './components/Notifications';
import AppOffline from './components/AppOffline';
import { i18n } from './helpers/i18n';
import { appStatus } from './actions/app-status';

import 'flatpickr/dist/flatpickr.min.css';
// import "flatpickr/dist/themes/airbnb.css";
import BannerAndroid from './components/Common/BannerAndroid';
import BannerIos from './components/Common/BanneriOS';
import { CustomThemeProvider } from './providers';
import { AppWrapper } from './components/AppWrapper';
import { GlobalStyle, GlobalFont } from './globalStyles';
import { useTenant } from './hooks/useTenant';
import { PaymentStatus } from 'smartbox-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouteGuest } from './components/Common/RouteGuest';
import { MaintenanceScreen } from './components/MaintenanceScreen';

const DashboardAdmin = React.lazy(() => import('./views/DashboardAdmin'));
const DashboardUser = React.lazy(() => import('./views/DashboardUser'));
const DashboardTenant = React.lazy(() => import('./views/DashboardTenant'));
const DashboardWorker = React.lazy(() => import('./views/DashboardWorker'));

flatpickr.localize(Polish);
flatpickr.defaultConfig.time_24hr = true;

const createStoreWithMiddleware = composeWithDevTools(
  applyMiddleware(reduxThunk),
)(createStore);

export const store = createStoreWithMiddleware(reducers);

const queryClient = new QueryClient();

export const history = createBrowserHistory({ basename: '/' });

const AppGlobalStyles = () => {
  const { tenant } = useTenant();

  return (
    <>
      {tenant ? <GlobalFont tenantId={tenant.id} /> : null}
      <GlobalStyle tenant={tenant} />
    </>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const checkI18nLoaded = () => {
    if (i18n.loaded) {
      setLoading(false);
    } else {
      setTimeout(checkI18nLoaded, 100);
    }
  };

  useEffect(() => {
    const lang = store.getState().lang.current;
    i18n.load(lang);
    checkI18nLoaded();
  }, []);

  if (loading || !i18n.loaded) return null;

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

                <ErrorBoundary>
                  <Suspense fallback={<Spinner />}>
                    <Switch>
                      <Route
                        exact
                        path="/"
                        render={() => <Redirect to="/login" />}
                      />
                      <RouteGuest path="/welcome" component={Welcome} />
                      <RouteGuest path="/login" component={Login} />
                      <RouteGuest exact path="/register" component={Register} />
                      <RouteGuest
                        path="/register/mail-was-send"
                        component={EmailSend}
                      />
                      <RouteGuest
                        exact
                        path="/restore-pass/"
                        component={RestorePass}
                      />
                      <RouteGuest
                        path="/restore-pass/:userId/:updateToken"
                        component={RestorePass}
                      />
                      <RouteGuest
                        path="/google-success/:googleToken"
                        component={GoogleAuth}
                      />
                      <RouteGuest
                        path="/resend-activation-link"
                        component={ResendActivationLink}
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
                        path="/payment-success/"
                        render={() => (
                          <PaymentResult status={PaymentStatus.accepted} />
                        )}
                      />
                      <Route
                        path="/payment-failed/"
                        render={() => (
                          <PaymentResult status={PaymentStatus.failure} />
                        )}
                      />
                      <Route
                        path="/payment-pending/"
                        render={() => (
                          <PaymentResult status={PaymentStatus.wait} />
                        )}
                      />
                      <Route
                        path="/payment-error/"
                        render={() => <PaymentResult />}
                      />

                      <RouteAdmin path="/admin" component={DashboardAdmin} />
                      <RouteWorker path="/worker" component={DashboardWorker} />
                      <RouteUser path="/user" component={DashboardUser} />
                      <RouteTenant path="/client" component={DashboardTenant} />

                      <Route exact path="/404" component={Page404} />
                      <Route component={Page404} />
                    </Switch>
                  </Suspense>
                </ErrorBoundary>

                <BannerAndroid />
                <BannerIos />
                <Modal />
                <Cookies />
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
  (name: string, mapEventToAction: any) => (dispatch: any) => {
    const handleEvent = (e: any) => {
      dispatch(mapEventToAction(e));
    };
    window.addEventListener(name, handleEvent);
  };

store.dispatch(listenToWindowEvent('offline', appStatus));

store.dispatch(listenToWindowEvent('online', appStatus));

store.dispatch(
  appStatus({ type: window.navigator.onLine ? 'online' : 'offline' }),
);

export { ReactSelect };
export default App;
