import { BoxGroupUserRes } from 'smartbox-types';
import { __ } from 'src/helpers/i18n';
import { getColorForBackground } from 'src/utils/color';
import styled from 'styled-components';

export type LeftCounterProps = {
  option: BoxGroupUserRes;
};

const StyledCounter = styled('div')(({ theme }) => ({
  height: 40,
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  justifyContent: 'center',
  borderRadius: theme.spacing * 5,
     padding: theme.spacing * 4,
  background: theme.colors.secondary,
  width: '100%',
  color: getColorForBackground(theme.colors.secondary)
}));

export const LeftCounter = ({ option }: LeftCounterProps) => {
  if (!option.left) return null;

  return (
    <StyledCounter>
      <span>
        {__('application.left')} <strong>{option.left}</strong>!
      </span>
    </StyledCounter>
  );
};
