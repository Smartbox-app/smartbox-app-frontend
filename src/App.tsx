import React, { useState, useEffect, Suspense } from 'react';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import ReactSelect from 'react-select';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Route, Router, Switch, Redirect } from 'react-router-dom';
import { WorkBoxProvider } from 'react-workbox';
import { createBrowserHistory } from 'history';
import flatpickr from 'flatpickr';
import { Polish } from 'flatpickr/dist/l10n/pl';
import reducers from './reducers';
import { Page404, Welcome } from './views';
import {
    OnlineContent,
    OfflineContent,
    UpdateInfoBar,
    RouteAdmin,
    RouteUser,
    RouteWorker,
    Modal,
    ErrorBoundary,
    Cookies,
    RouteTenant,
} from './components/Common';
import { Spinner } from './components/Branded';
import { EmailConfirm, Login, Register, RestorePass, UserActivation, EmailSend, GoogleAuth, TenantActivation, ResendActivationLink } from './views/Auth';
import { Invoice, PaymentFailed } from './views/DashboardCommon';
import { NotificationContainer } from './components/Notifications';
import AppOffline from './components/AppOffline';
import { i18n } from './helpers/i18n';
import { appStatus } from './actions/app-status';

import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/airbnb.css';
import BannerAndroid from './components/Common/BannerAndroid';
import BannerIos from './components/Common/BanneriOS';
import { CustomThemeProvider } from './providers';
import { AppWrapper } from './components/AppWrapper';
import GlobalStyle from './globalStyles';
import { useTenant } from './hooks/useTenant';

const DashboardAdmin = React.lazy(() => import('./views/DashboardAdmin'));
const DashboardUser = React.lazy(() => import('./views/DashboardUser'));
const DashboardTenant = React.lazy(() => import('./views/DashboardTenant'));
const DashboardWorker = React.lazy(() => import('./views/DashboardWorker'));

flatpickr.localize(Polish);
flatpickr.defaultConfig.time_24hr = true;

const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(reduxThunk))(createStore);

export const store = createStoreWithMiddleware(reducers);

export const history = createBrowserHistory({ basename: '/' });

const AppGlobalStyles = () => {
    const { tenant } = useTenant();

    if (tenant && tenant.id) {
        return <GlobalStyle tenantId={tenant.id} />
    }

    return <></>
}

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

    if (loading) return null;

    return (
        <WorkBoxProvider>
            <Provider store={store}>
                <Router history={history}>
                    <CustomThemeProvider>
                        <AppWrapper>
                            <AppGlobalStyles />
                            <OnlineContent>
                                <UpdateInfoBar />
                                <NotificationContainer />

                                <ErrorBoundary>
                                    <Suspense fallback={<Spinner />} >
                                        <Switch>
                                            <Route exact path="/" render={() => <Redirect to="/login" />} />
                                            <Route path="/welcome" component={Welcome} />
                                            <Route path="/login" component={Login} />
                                            <Route exact path="/register" component={Register} />
                                            <Route path="/register/mail-was-send" component={EmailSend} />
                                            <Route exact path="/restore-pass/" component={RestorePass} />
                                            <Route path="/restore-pass/:userId/:updateToken" component={RestorePass} />
                                            <Route path="/google-success/:googleToken" component={GoogleAuth} />
                                            <Route path='/resend-activation-link' component={ResendActivationLink} />
                                            <Route path="/user-activation/:invitationId/:updateToken" component={UserActivation} />
                                            <Route path="/tenant-activation/:userId/:updateToken" component={TenantActivation} />
                                            <Route path="/join-from-invitation/:invitationId/:updateToken" component={UserActivation} />

                                            <Route exact path="/email-confirmation/:userId/:updateToken" component={EmailConfirm} />

                                            <Route path="/payment-success/:paymentId" component={Invoice} />
                                            <Route path="/payment_finish_screen/ok" component={Invoice} />
                                            <Route path="/payment-failed/" component={PaymentFailed} />
                                            <Route path="/payment_finish_screen/error" component={PaymentFailed} />

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
        </WorkBoxProvider>
    );
};

const listenToWindowEvent = (name: string, mapEventToAction: any) => (dispatch: any) => {
    const handleEvent = (e: any) => {
        dispatch(mapEventToAction(e));
    };
    window.addEventListener(name, handleEvent);
};

store.dispatch(listenToWindowEvent('offline', appStatus));

store.dispatch(listenToWindowEvent('online', appStatus));

store.dispatch(appStatus({ type: window.navigator.onLine ? 'online' : 'offline' }));

export { ReactSelect };
export default App;
