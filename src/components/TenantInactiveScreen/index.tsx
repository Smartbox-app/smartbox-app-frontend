import styled from 'styled-components';

import { Logo } from 'src/components/Branded';
import { Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

const StyledContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw',
  fontSize: '1.5rem',
  padding: 24,
  textAlign: 'center',
  boxSizing: 'border-box',
  svg: {
    width: 200,
    height: 200,
    fill: '#000',
  },
});

export const TenantInactiveScreen = () => {
  return (
    <StyledContainer>
      <Logo />
      <Typography>{__('application.tenantPlatformInactive')}</Typography>
    </StyledContainer>
  );
};
