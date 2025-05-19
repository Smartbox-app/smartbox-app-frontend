import styled from 'styled-components';

export type IndicatorProps = {
  selected: boolean;
};

const StyledIndicatorOuter = styled('div')<{ selected: boolean }>(
  ({ theme, selected }) => ({
    width: theme.spacing * 5,
    height: theme.spacing * 5,
    border: `2px solid ${selected ? theme.colors.primary : theme.colors.border.primary}`,
    padding: theme.spacing / 2,
    borderRadius: '50%',
    flex: '0 0 auto',
  }),
);

const StyledIndicatorInner = styled('div')<{ selected: boolean }>(
  ({ theme, selected }) => ({
    width: '100%',
    height: '100%',
    background: selected ? theme.colors.primary : 'transparent',
    borderRadius: '50%',
  }),
);

export const Indicator = ({ selected }: IndicatorProps) => {
  return (
    <StyledIndicatorOuter selected={selected}>
      <StyledIndicatorInner selected={selected} />
    </StyledIndicatorOuter>
  );
};
