import { TenantForUsers } from "smartbox-types";
import ApiService from "../services/api-service";

export const setTenant = (tenant: TenantForUsers | null) => ({ type: 'SET_TENANT', payload: tenant })

export const getTenantById = (id: string) => async (dispatch: any) => {
    await ApiService.get(
        dispatch,
        'GET_TENANT_SUCCESS',
        'GET_TENANT_FAILED',
        (data: TenantForUsers) => {
            dispatch(setTenant(data))
        },
        null,
        `tenant/id/${id}`,
        'LOADING',
    );
};