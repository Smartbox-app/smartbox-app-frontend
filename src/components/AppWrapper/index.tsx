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
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMyData());
    }, [])

    useEffect(() => {
        if (user && user.tenantId)
            dispatch(getTenantById(user.tenantId));
    }, [user])

    return <>{children}</>
}

export { AppWrapper }