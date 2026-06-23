import React from 'react';
import { useTenant } from '../../../hooks/useTenant';
import { history } from 'src/history';
import UserService from '../../../services/user-service';
import styled from 'styled-components';
import { useGetMyDetailsQuery } from '../../../queries';
import { useFileStorage } from 'src/hooks/useFileStorage';

type LogoWidths = 'large' | 'medium' | 'small';

const getWidth = (width: LogoWidths) => {
  switch (width) {
    case 'large':
      return 250;
    case 'medium':
      return 130;
    default:
      return 80;
  }
};

const LogoContainer = styled('div')<{ width: LogoWidths }>(
  ({ width, theme }) => ({
    width: getWidth(width),
    padding: width === 'large' ? `${theme.spacing * 5}px 0` : 0,
  }),
);

const StyledLogo = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

export type LogoProps = {
  width?: LogoWidths;
};

const Logo = ({ width = 'large' }: LogoProps) => {
  const { tenant } = useTenant();
  const { getAssetPath } = useFileStorage();
  const { data: user } = useGetMyDetailsQuery();

  const handleLogoClick = () => {
    if (user) history.push(`/${UserService.getSlugByRole(user.role)}`);
    else history.push('/');
  };

  if (!tenant) return null;

  return (
    <LogoContainer width={width}>
      <StyledLogo
        src={getAssetPath('logo', tenant.logo)}
        onError={({ currentTarget }) => (currentTarget.style.display = 'none')}
        alt={tenant.name}
        onClick={handleLogoClick}
      />
    </LogoContainer>
  );
};

export { Logo };
