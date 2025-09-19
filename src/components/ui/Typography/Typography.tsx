import { ReactNode } from "react";
import styled from "styled-components";

export type TypographyProps = {
  children: ReactNode;
};

const StyledTypography = styled("p")(({ theme }) => ({
  fontSize: 14,
  lineHeight: "20px",
  color: theme.colors.text.primary,
  whiteSpace: 'pre-wrap'
}));

export const Typography = ({ children }: TypographyProps) => {
  return <StyledTypography>{children}</StyledTypography>;
};
