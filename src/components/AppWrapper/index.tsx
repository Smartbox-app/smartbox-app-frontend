import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyData } from '../../actions/users';
import { ApplicationState } from '../../reducers';
import { getTenantById } from '../../actions/tenant';

interface Props {
    children: React.ReactNode;
}

const AppWrapper = ({ children }: Props) => {
    const user = useSelector((state: ApplicationState) => state.user.details);
    const tenant = useSelector((state: ApplicationState) => state.tenant);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMyData());
    }, [])

    useEffect(() => {
        if (user && user.tenantId)
            dispatch(getTenantById(user.tenantId));
    }, [user])

    if(user && user.tenantId && (!tenant || !tenant.id)) return null;

    return <>{children}</>
}

export { AppWrapper }