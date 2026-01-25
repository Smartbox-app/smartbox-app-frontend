import { ReactNode } from "react";
import styled from "styled-components";

export type TypographyProps = {
  children: ReactNode;
  className?: string;
};

const StyledTypography = styled("p")(({ theme }) => ({
  fontSize: 14,
  lineHeight: "20px",
  color: theme.colors.text.primary,
  whiteSpace: 'pre-wrap',
  display: 'inline'
}));

export const Typography = ({ children, className }: TypographyProps) => {
  return <StyledTypography className={className}>{children}</StyledTypography>;
};
