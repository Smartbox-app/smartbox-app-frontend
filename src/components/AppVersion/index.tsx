import { useMemo } from "react";
import styled from "styled-components";

type AppVersionVariants = "default" | "secondary";

const StyledVersion = styled("div")<{ variant: AppVersionVariants }>(
  ({ theme, variant }) => ({
    fontSize: "inherit",
    textAlign: "center",
    color: variant === "secondary" ? theme.colors.text.disable : "inherit",
  })
);

export type AppVersionProps = {
  variant?: AppVersionVariants;
};

export const AppVersion = ({ variant = 'default' }: AppVersionProps) => {
  const version = useMemo(() => {
    return localStorage.getItem("v");
  }, []);

  return <StyledVersion variant={variant}>{version}</StyledVersion>;
};
