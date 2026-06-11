import React, { useCallback } from 'react';
import { TenantForUsers } from 'smartbox-types';
import styled from 'styled-components';
import { useTenant } from '../../../hooks/useTenant';
import ApiService from '../../../services/api-service';
import { Container } from '../../ui';
import { useLocation } from 'react-router';

export type PageContentVariant = 'default' | 'dashboard';

interface Props {
  children: React.ReactNode;
  bg?: boolean;
  conditionalBg?: boolean;
  variant?: PageContentVariant;
}

const StyledPageContent = styled.div<{
  $variant: PageContentVariant;
  $backgroundUrl: string | null;
}>(({ theme, $variant, $backgroundUrl }) => {
  const s = theme.spacing;

  const base = {
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'relative' as const,
    width: '100%',
    backgroundColor: theme.colors.background.tertiary,
    backgroundImage: $backgroundUrl ? `url(${$backgroundUrl})` : undefined,
    backgroundSize: $backgroundUrl ? ('cover' as const) : undefined,
    backgroundPosition: $backgroundUrl ? ('center' as const) : undefined,
  };

  if ($variant === 'dashboard') {
    return {
      ...base,
      flex: 1,
      minHeight: 0,
      height: '100%',
      padding: 0,
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      overflow: 'auto',
    };
  }

  return {
    ...base,
    flex: '1 0 auto',
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'auto',
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: 'env(safe-area-inset-bottom)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
    '@media (min-width: 435px)': {
      padding: `${s * 5}px`,
      paddingTop: `calc(${s * 5}px + env(safe-area-inset-top))`,
      paddingBottom: `calc(${s * 5}px + env(safe-area-inset-bottom))`,
      paddingLeft: `calc(${s * 5}px + env(safe-area-inset-left))`,
      paddingRight: `calc(${s * 5}px + env(safe-area-inset-right))`,
    },
    '@media (min-width: 768px)': {
      padding: `${s * 2.5}px ${s * 7.5}px`,
      paddingTop: `calc(${s * 2.5}px + env(safe-area-inset-top))`,
      paddingBottom: `calc(${s * 2.5}px + env(safe-area-inset-bottom))`,
      paddingLeft: `calc(${s * 7.5}px + env(safe-area-inset-left))`,
      paddingRight: `calc(${s * 7.5}px + env(safe-area-inset-right))`,
    },
  };
});

const PageContent = ({
  children,
  bg,
  conditionalBg,
  variant = 'default',
}: Props) => {
  const { tenant } = useTenant();
  const location = useLocation();

  const getTenantBackgroundPath = useCallback(
    (tenant: TenantForUsers) => {
      if (!tenant.id) return tenant.background;
      return `${ApiService.url}tenant/background/${tenant.id}`;
    },
    [tenant],
  );

  const showConditionalBg =
    variant === 'default' && conditionalBg
      ? location.pathname.includes('order')
      : false;

  if (!tenant) return null;

  const showBackground = variant === 'default' && (bg || showConditionalBg);

  return (
    <StyledPageContent
      $variant={variant}
      $backgroundUrl={showBackground ? getTenantBackgroundPath(tenant) : null}
    >
      {variant === 'dashboard' ? children : <Container>{children}</Container>}
    </StyledPageContent>
  );
};

export { PageContent };
