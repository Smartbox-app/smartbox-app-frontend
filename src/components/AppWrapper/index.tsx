import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyData } from '../../actions/users';
import { ApplicationState } from '../../reducers';
import { getTenantById } from '../../actions/tenant';
import ApiService from '../../services/api-service';
import { AppSettingsEntity } from 'smartbox-types';

interface Props {
    children: React.ReactNode;
}

const AppWrapper = ({ children }: Props) => {
    const user = useSelector((state: ApplicationState) => state.user.details);
    const tenant = useSelector((state: ApplicationState) => state.tenant);
    const dispatch = useDispatch();

    const getVersion = async () => {
        await ApiService.callFetch('GET', 'settings/version', (version: string) => {
            const currentVersion = localStorage.getItem('v') || null;

            if (!currentVersion) window.location.reload();

            if (version && currentVersion !== version) {
                localStorage.setItem('v', version);
                window.location.reload()
            }

        })
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getVersion();
        }, 30000);

        return () => {
            clearInterval(interval);
        }
    }, [])

    useEffect(() => {
        getVersion();
        dispatch(fetchMyData());
    }, [])

    useEffect(() => {
        if (user && user.tenantId)
            dispatch(getTenantById(user.tenantId));
    }, [user])

    if (user && user.tenantId && (!tenant || !tenant.id)) return null;

    return <>{children}</>
}

export { AppWrapper }