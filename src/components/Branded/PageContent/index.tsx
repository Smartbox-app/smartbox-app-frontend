import React, { useCallback } from 'react';
import { TenantForUsers } from 'smartbox-types';
import styled from 'styled-components';
import { useTenant } from '../../../hooks/useTenant';
import ApiService from '../../../services/api-service';
import './PageContent.scss';
import { Container } from '../../ui';
import { useLocation } from 'react-router';

interface Props {
  children: React.ReactNode;
  bg?: boolean;
  conditionalBg?: boolean;
}

const StyledPageContent = styled('div')<{ background: string | null }>(
  ({ background }) => ({
    backgroundImage: background ? `url(${background})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTtop: 'env(safe-area-inset-top)',
    paddingBottom: 'env(safe-area-inset-bottom)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
  }),
);

const PageContent = ({ children, bg, conditionalBg }: Props) => {
  const { tenant } = useTenant();
  const location = useLocation();

  const getTenantBackgroundPath = useCallback(
    (tenant: TenantForUsers) => {
      if (!tenant.id) return tenant.background;
      return `${ApiService.url}tenant/background/${tenant.id}`;
    },
    [tenant],
  );

  const showConditionalBg = conditionalBg
    ? location.pathname.includes('order')
    : false;

  if (!tenant) return null;

  return (
    <StyledPageContent
      background={
        bg || showConditionalBg ? getTenantBackgroundPath(tenant) : null
      }
      className={`page-content ${bg || showConditionalBg ? 'bg' : ''}`}
    >
      <Container>{children}</Container>
    </StyledPageContent>
  );
};

export { PageContent };
