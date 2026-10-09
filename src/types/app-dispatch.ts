import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

export type AppDispatch = ThunkDispatch<unknown, undefined, AnyAction>;
