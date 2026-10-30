import {ApiResult} from "src/smartbox-types/apiMessages/apiResults";
import {ApiErrorCode} from "src/smartbox-types/apiMessages/errorCodes";

interface ApiMessage {
    result: ApiResult;
}

export interface ApiErrorMessage extends ApiMessage{
    error_code: ApiErrorCode;
    details?: string;
    form_errors?: unknown;
    error_log_id?: string;
    payload?: unknown;
}

export interface ApiOkMessage<T> extends ApiMessage{
    payload: T;
}