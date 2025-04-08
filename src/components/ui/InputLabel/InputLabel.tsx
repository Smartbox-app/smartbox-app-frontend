import { ReactNode } from 'react';
import styled from 'styled-components';

export type InputLabelProps = {
  labelFor?: string;
  children: ReactNode;
};

const StyledLabel = styled('label')(({ theme }) => ({
  color: theme.colors.text.secondary,
  fontWeight: 400,
  lineHeight: '20px',
}));

export const InputLabel = ({ children, labelFor }: InputLabelProps) => {
  return <StyledLabel htmlFor={labelFor}>{children}</StyledLabel>;
};
