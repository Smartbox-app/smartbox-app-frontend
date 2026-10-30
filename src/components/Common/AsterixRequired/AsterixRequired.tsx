import styled from 'styled-components';

const StyledAsterix = styled('span')(({ theme }) => ({
  color: theme.colors.surface.error.primary,
}));

export const AsterixRequired = () => {
  return <StyledAsterix>*</StyledAsterix>;
};
