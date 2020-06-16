import React, { useState, useEffect } from 'react';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Route, Router, Switch, Redirect } from 'react-router-dom';
import { WorkBoxProvider } from 'react-workbox';
import { createBrowserHistory } from 'history';
import reducers from './reducers';
import { Login, DashboardAdmin, DashboardWorker, DashboardUser, Register, RestorPass } from './views';
import {
  OnlineContent,
  OfflineContent,
  UpdateInfoBar,
  Spinner,
  RouteAdmin,
  RouteUser,
  RouteWorker,
  Modal,
} from './components/Common';
import { NotificationContainer } from './components/Notifications';
import AppOffline from './components/AppOffline';
import { i18n } from './helpers/i18n';
import { appStatus } from './actions/app-status';

const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(reduxThunk))(createStore);

export const store = createStoreWithMiddleware(reducers);

export const history = createBrowserHistory({ basename: '/' });

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

  if (loading) return <Spinner overlay />;

  return (
    <WorkBoxProvider>
      <Provider store={store}>
        <OnlineContent>
          <UpdateInfoBar />
          <NotificationContainer />
          <Router history={history}>
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/login" />} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/restore-pass" component={RestorPass} />
              <RouteAdmin path="/admin" component={DashboardAdmin} />
              <RouteWorker path="/worker" component={DashboardWorker} />
              <RouteUser path="/user" component={DashboardUser} />
              <Route render={() => <Redirect to="/404" />} />
            </Switch>
          </Router>
          <Modal />
        </OnlineContent>
        <OfflineContent>
          <AppOffline />
        </OfflineContent>
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

export default App;
