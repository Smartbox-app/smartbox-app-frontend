import { applyMiddleware, createStore } from 'redux';
import reduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducers';

const createStoreWithMiddleware = composeWithDevTools(
  applyMiddleware(reduxThunk),
)(createStore);

export const store = createStoreWithMiddleware(reducers);
