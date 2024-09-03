import {ApiResult} from "./apiResults";
import {ApiErrorCode} from "./errorCodes";

interface ApiMessage {
    result: ApiResult;
}

export interface ApiErrorMessage extends ApiMessage{
    error_code: ApiErrorCode;
    details?: string;
    form_errors?: any;
    error_log_id?: string;
}

export interface ApiOkMessage<T> extends ApiMessage{
    payload: T;
}