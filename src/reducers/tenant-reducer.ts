import { TenantEntity } from "smartbox-types";

interface SetTenant {
    type: 'SET_TENANT';
    payload: TenantEntity;
}

type Action = SetTenant;

export type TenantState = TenantEntity | null;

const initialState = null;

export default (state: TenantState = initialState, action: Action) => {
    switch (action.type) {
        case 'SET_TENANT':
            if(!state) return action.payload;
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};
