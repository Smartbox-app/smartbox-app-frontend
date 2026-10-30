import styled from 'styled-components';

import { translateUiError } from 'src/utils/translate-ui-error';

export type ErrorTextProps = {
  error: string;
};

const StyledErrorText = styled('p')(({ theme }) => ({
  color: theme.colors.danger,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 400,
}));

export const ErrorText = ({ error }: ErrorTextProps) => {
  return <StyledErrorText>{translateUiError(error)}</StyledErrorText>;
};
