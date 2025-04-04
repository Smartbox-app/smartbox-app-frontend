import { ReactNode } from "react";
import styled from "styled-components";

export type StackProps = {
  children: ReactNode;
};

const StyledStack = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing * 4,
  width: '100%',
  flex: 1,
}));

export const Stack = ({ children }: StackProps) => {
  return <StyledStack>{children}</StyledStack>;
};
