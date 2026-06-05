import { NavLink } from 'react-router-dom';
import { __ } from 'src/helpers/i18n';
import { SidebarNavGroup } from 'src/types/sidebar-nav';
import styled, { css } from 'styled-components';

export type NestedSidebarNavProps = {
  groups: SidebarNavGroup[];
};

const StyledNestedSidebarNav = styled.nav(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing * 3,
  width: '100%',
}));

const StyledGroup = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing * 0.5,
}));

const StyledGroupHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing * 2,
  padding: `${theme.spacing}px ${theme.spacing * 3}px`,
  fontSize: 12,
  fontWeight: 700,
  lineHeight: '16px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: theme.colors.text.secondary,

  svg: {
    fill: theme.colors.icon.grey.primary,
    flexShrink: 0,
  },
}));

const itemStyles = css(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing * 2,
  fontSize: 13,
  lineHeight: '20px',
  padding: `${theme.spacing * 2}px ${theme.spacing * 3}px`,
  paddingLeft: theme.spacing * 2,
  color: theme.colors.text.primary,
  borderRadius: theme.radius.innerSurface,
  textDecoration: 'none',

  svg: {
    fill: theme.colors.icon.grey.primary,
    flexShrink: 0,
    width: theme.spacing * 5,
    height: theme.spacing * 5,
  },

  '&:link, &:visited': {
    color: theme.colors.text.primary,
  },

  '&:hover': {
    background: theme.colors.border.secondary,
    svg: {
      fill: theme.colors.icon.primary,
    },
  },

  '&.active': {
    background: theme.colors.surface.information.secondary,
    // borderLeftColor: theme.colors.primary,
    color: theme.colors.primary,
    fontWeight: 500,
    svg: {
      fill: theme.colors.icon.primary,
    },
  },
}));

const activeItemStyles = css(({ theme }) => ({
  background: theme.colors.surface.information.secondary,
  borderLeftColor: theme.colors.primary,
  color: theme.colors.primary,
  fontWeight: 500,
  svg: {
    fill: theme.colors.icon.primary,
  },
}));

const StyledSidebarLink = styled(NavLink)(itemStyles);
const StyledSidebarItem = styled.button<{ $active?: boolean }>`
  ${itemStyles}
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  ${({ $active }) => $active && activeItemStyles}
`;

const StyledGroupItems = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

export const NestedSidebarNav = ({ groups }: NestedSidebarNavProps) => (
  <StyledNestedSidebarNav>
    {groups.map((group) => (
      <StyledGroup key={group.text}>
        <StyledGroupHeader>
          {__(group.text)}
        </StyledGroupHeader>
        <StyledGroupItems>
          {group.items.map((item) =>
            item.to ? (
              <StyledSidebarLink to={item.to} key={item.text}>
                {item.icon}
                {__(item.text)}
              </StyledSidebarLink>
            ) : (
              <StyledSidebarItem
                type="button"
                key={item.text}
                $active={item.active}
                onClick={item.onClick}
              >
                {item.icon}
                {__(item.text)}
              </StyledSidebarItem>
            ),
          )}
        </StyledGroupItems>
      </StyledGroup>
    ))}
  </StyledNestedSidebarNav>
);
