import {ApiErrorMessage, ApiOkMessage} from "./messageTypes";

export type BaseResultMessage<T> = ApiErrorMessage|ApiOkMessage<T>;