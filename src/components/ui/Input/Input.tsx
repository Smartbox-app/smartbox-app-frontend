import { UseFormRegisterReturn } from "react-hook-form";
import { __ } from "../../../helpers/i18n";
import styled from "styled-components";
import { forwardRef } from "react";

const StyledContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing * 2,
  width: "100%",
}));

const StyledInput = styled("input")(({ theme }) => ({
  fontSize: 14,
  lineHeight: "20px",
  color: theme.colors.text.primary,
  background: theme.colors.background.white,
  padding: `${theme.spacing * 3}px ${theme.spacing * 5}px`,
  border: `1px solid ${theme.colors.border.primary}`,
  borderRadius: theme.radius.outerSurface,

  "&::placeholder": {
    color: theme.colors.text.tertiary,
  },
  "&:focus": {
    borderColor: theme.colors.primary,
  },
}));

const StyledLabel = styled("label")(({ theme }) => ({
  color: theme.colors.text.secondary,
  fontWeight: 400,
  lineHeight: "20px",
}));

export type InputProps = {
  label: string;
  placeholder: string;
  type?: string;
} & UseFormRegisterReturn;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, placeholder, type = "text", ...register }, ref) => {
    return (
      <StyledContainer>
        <StyledLabel>{__(label)}</StyledLabel>
        <StyledInput
          {...register}
          ref={ref}
          type={type}
          placeholder={placeholder ? __(placeholder) : ""}
        />
      </StyledContainer>
    );
  }
);
