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
  color: getColorForBackground(theme.colors.secondary),
}));

export const LeftCounter = ({ option }: LeftCounterProps) => {
  if (!option.left) return null;

  const getText = () => {
    const { left } = option;

    if(!left) return;

    if (left >= 5) return 'application.left_more';
    if (left >= 2) return 'application.left_two_four';
    return 'application.left_one';
  };

  return (
    <StyledCounter>
      <span>
        {__(getText())} <strong>{option.left}</strong>!
      </span>
    </StyledCounter>
  );
};
