import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { TenantEntity } from "smartbox-types";
import { setTenant as setTenantAction } from '../actions/tenant'
import ApiService from "../services/api-service";
import { ApplicationState } from "src/reducers";

interface UseTenant {
    tenant: TenantEntity | null;
}

const useTenant = (): UseTenant => {
    const dispatch = useDispatch();
    const tenantData = useSelector((state: ApplicationState) => state.tenant);
    const [tenant, setTenant] = useState<TenantEntity | null>(tenantData);
    const location = useLocation();
    const queryParameters = new URLSearchParams(location.search);

    useEffect(() => {
        if(!tenantData) fetchTenantData();
    }, [])

    useEffect(() => {
        if(tenantData) setTenant(tenantData);
    }, [tenantData])

    const fetchTenantData = async () => {
        const clientId = queryParameters.get('clientId');

        if (!clientId) {
            setDefaults();
            return;
        }

        await ApiService.callFetch('GET', `tenant/${clientId}`, (tenantRes: TenantEntity) => {
            setTenant(tenantRes);
            dispatch(setTenantAction(tenantRes));
        })
    }

    const setDefaults = () => {
        setTenant({
            id: '',
            identifier: '',
            colorPrimary: '#0674bd',
            colorSecondary: '#ffca3c',
            logo: "/assets/images/Smartbox-logo-color.png",
            background: "/assets/images/bg.jpg",
            slides: [],
            name: 'SmartBox',
            contactEmail: '',
            contactPhone: '',
            fontBold: '',
            fontLight: '',
            fontNormal: ''
        })
    }

    return {
        tenant
    }
}

export { useTenant }