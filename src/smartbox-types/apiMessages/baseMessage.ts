import {ApiErrorMessage, ApiOkMessage} from "src/smartbox-types/apiMessages/messageTypes";

export type BaseResultMessage<T> = ApiErrorMessage|ApiOkMessage<T>;