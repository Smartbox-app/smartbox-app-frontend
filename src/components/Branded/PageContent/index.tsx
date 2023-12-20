import React, { useCallback } from 'react';
import { TenantForUsers } from 'smartbox-types';
import styled from 'styled-components';
import { useTenant } from '../../../hooks/useTenant';
import ApiService from '../../../services/api-service';
import './PageContent.scss';

interface Props {
    children: React.ReactNode;
    bg?: boolean;
}

const StyledPageContent = styled.div<{ background: string }>`
background-image: url(${props => props.background});
background-size: cover;
background-position: center;
`

const PageContent = ({ children, bg }: Props) => {
    const { tenant } = useTenant();

    const getTenantBackgroundPath = useCallback((tenant: TenantForUsers) => {
        if (!tenant.id) return tenant.background;
        return `${ApiService.url}tenant/background/${tenant.id}`;
    }, [tenant])

    if (!tenant) return null;

    return <StyledPageContent background={getTenantBackgroundPath(tenant)} className={`page-content ${bg ? 'bg' : ''}`}>{children}</StyledPageContent>;
}


export { PageContent };
