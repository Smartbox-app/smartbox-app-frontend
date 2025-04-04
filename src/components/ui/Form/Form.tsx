import { FormEvent, ReactNode } from "react";
import styled from "styled-components";

export type FormProps = {
  children: ReactNode;
  onSubmit: (e: FormEvent) => void;
};

const StyledForm = styled("form")({
  width: "100%",
});

export const Form = ({ children, onSubmit }: FormProps) => {
  return <StyledForm onSubmit={onSubmit}>{children}</StyledForm>;
};
