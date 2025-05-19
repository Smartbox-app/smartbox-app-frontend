import { ReactNode } from "react";
import styled from "styled-components";

export type RowProps = {
  children: ReactNode;
  
};

const StyledRow = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing * 2,
  flex: 1,
}));

export const Row = ({ children }: RowProps) => {
  return <StyledRow>{children}</StyledRow>;
};
