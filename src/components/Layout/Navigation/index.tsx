import { MenuItemType } from '../../../types/menu-item';

import { LogoContainer } from '../../Branded';

import './Navigation.scss';
import { useLogoutMutation } from 'src/mutations';
import styled from 'styled-components';
import { SidebarButton } from '../../ui/SidebarButton';
import { Logout } from '../../../icons';

interface Props {
  menuItems: MenuItemType[];
}

const StyledHeader = styled('header')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing * 2,
}));

const StyledNavigation = styled('nav')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing * 2,
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
    <StyledHeader>
      <LogoContainer />
      <StyledNavigation>{menu}</StyledNavigation>
    </StyledHeader>
  );
};
