import styled from 'styled-components';

import { LogoContainer } from 'src/components/Branded';
import { SidebarButton } from 'src/components/ui/SidebarButton';
import { Logout } from 'src/icons';
import { useLogoutMutation } from 'src/mutations';
import { MenuItemType } from 'src/types/menu-item';

import './Navigation.scss';

interface Props {
  menuItems: MenuItemType[];
}

const StyledNavigationContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: theme.colors.background.primary,
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
  boxShadow: '0 5px 10px 0 rgba(1, 18, 34, 0.62)',
  padding: theme.spacing,
  zIndex: 100,
  '@media(min-width: 768px)': {
    position: 'relative',
    gap: theme.spacing * 2,
    background: 'transparent',

    boxShadow: 'none',
  },
  paddingBottom: 'env(safe-area-inset-bottom)'
}));

const StyledNavigation = styled('nav')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing * 2,
  width: '100%',
  '@media(min-width: 768px)': {
    justifyContent: 'flex-end',
  },
}));

export const Navigation = ({ menuItems }: Props) => {
  const { mutate: logout } = useLogoutMutation();
  const basicItems: MenuItemType[] = [
    {
      icon: <Logout />,
      text: 'application.logout',
      onClick: () => logout(),
    },
  ];

  const menu = [...menuItems, ...basicItems].map((item: MenuItemType) => (
    <SidebarButton
      key={item.text}
      to={item.to}
      icon={item.icon}
      text={item.text}
      onClick={item.onClick}
    />
  ));

  return (
    <StyledNavigationContainer>
      <LogoContainer />
      <StyledNavigation>{menu}</StyledNavigation>
    </StyledNavigationContainer>
  );
};
