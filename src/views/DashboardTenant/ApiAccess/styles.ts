import styled from 'styled-components';

export const StyledPre = styled.pre(({ theme }) => ({
  backgroundColor: theme.colors.background.secondary,
  padding: theme.spacing * 3,
  borderRadius: theme.radius.innerSurface,
  overflow: 'auto',
  fontFamily: 'monospace',
  fontSize: 13,
  lineHeight: 1.5,
  margin: 0,
  whiteSpace: 'pre',
}));