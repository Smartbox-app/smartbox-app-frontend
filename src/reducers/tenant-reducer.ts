import { TenantForUsers } from "smartbox-types";

interface SetTenant {
    type: 'SET_TENANT';
    payload: TenantForUsers;
}

type Action = SetTenant;

export type TenantState = TenantForUsers | null;

const initialState = null;

export default (state: TenantState = initialState, action: Action) => {
    switch (action.type) {
        case 'SET_TENANT':
            if (!state) return action.payload;
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};
