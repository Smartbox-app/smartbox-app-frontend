import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";

export type LinkProps = {
  href?: string;
  to?: string;
  target?: '_blank';
  rel?: string;
  children: ReactNode;
};

const linkStyles = css(({ theme }) => ({
  color: theme.colors.text.primary,
  fontWeight: 500,
  textDecoration: "underline",
}));

const StyledA = styled("a")`
  ${linkStyles}
`;
const StyledRouterLink = styled(NavLink)`
  ${linkStyles}
`;

export const Link = ({ href, to, children, target, rel }: LinkProps) => {
  if (href) return <StyledA href={href} target={target} rel={rel}>{children}</StyledA>;
  if (to) return <StyledRouterLink to={to}>{children}</StyledRouterLink>;
  return null;
};
