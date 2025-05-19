import { ReactNode } from "react";
import styled from "styled-components";

export type StackProps = {
  children: ReactNode;
  className?: string;
};

const StyledStack = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing * 4,
  width: '100%',
  flex: 1,
}));

export const Stack = ({ children, className }: StackProps) => {
  return <StyledStack className={className}>{children}</StyledStack>;
};
