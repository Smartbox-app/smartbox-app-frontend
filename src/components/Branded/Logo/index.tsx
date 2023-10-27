import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { TenantEntity } from 'smartbox-types';
import { useTenant } from '../../../hooks/useTenant';
import { ApplicationState } from '../../../reducers';
import { history } from '../../../App';
import UserService from '../../../services/user-service';
import ApiService from '../../../services/api-service';

const Logo = () => {
    const { tenant } = useTenant();
    const user = useSelector((state: ApplicationState) => state.user.details);

    const handleLogoClick = () => {
        if (user) history.push(`/${UserService.getSlugByRole(user.role)}`);
        else history.push('/');
    }

    const getTenantLogoPath = useCallback((tenant: TenantEntity) => {
        if (!tenant.id) return tenant.logo;
        return `${ApiService.url}tenant/logo/${tenant.id}`;
    }, [tenant])

    if (!tenant) return null;

    return <img src={getTenantLogoPath(tenant)} onError={({ currentTarget }) => currentTarget.style.display = 'none'} alt={tenant.name} onClick={handleLogoClick} />
}

export { Logo }