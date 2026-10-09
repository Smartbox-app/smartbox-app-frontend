import { applyMiddleware, createStore, Store } from 'redux';
import reduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers, { ApplicationState } from './reducers';
import { AppDispatch } from './types/app-dispatch';

const createStoreWithMiddleware = composeWithDevTools(
  applyMiddleware(reduxThunk),
)(createStore);

export const store = createStoreWithMiddleware(reducers) as Store<
  ApplicationState
> & { dispatch: AppDispatch };
