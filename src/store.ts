import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxThunk from 'redux-thunk';

import reducers, { ApplicationState } from 'src/reducers';
import { AppDispatch } from 'src/types/app-dispatch';

const createStoreWithMiddleware = composeWithDevTools(
  applyMiddleware(reduxThunk),
)(createStore);

export const store = createStoreWithMiddleware(reducers) as Store<
  ApplicationState
> & { dispatch: AppDispatch };
