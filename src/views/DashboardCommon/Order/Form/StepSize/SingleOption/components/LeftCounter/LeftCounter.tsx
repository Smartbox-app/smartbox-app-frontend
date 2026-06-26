import { BoxGroupUserRes } from 'smartbox-types';
import { __ } from 'src/helpers/i18n';
import { getColorForBackground } from 'src/utils/color';
import styled from 'styled-components';
import { ErrorCircle, Alert } from 'src/icons';

export type LeftCounterProps = {
  option: BoxGroupUserRes;
  disabled?: boolean;
};

const StyledCounter = styled('div')<{ disabled?: boolean }>(
  ({ theme, disabled }) => ({
    height: 40,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing * 5,
    padding: theme.spacing * 4,
    background: theme.colors.secondary,
    color: getColorForBackground(theme.colors.secondary),
    position: 'absolute',
    top: theme.spacing * 4,
    left: theme.spacing * 4,
    gap: theme.spacing * 1,
    fontSize: '0.9rem',
    svg: {
      fill: getColorForBackground(theme.colors.secondary),
    },
  }),
);

export const LeftCounter = ({ option, disabled }: LeftCounterProps) => {
  if (!option.left && !disabled) return null;

  const getText = () => {
    const { left } = option;

    if (!left) return;

    if (left >= 5) return 'application.left_more';
    if (left >= 2) return 'application.left_two_four';
    return 'application.left_one';
  };

  return (
    <StyledCounter disabled={disabled}>
      {disabled ? (
        <>
          <ErrorCircle /> Niedostępny
        </>
      ) : (
        <>
          <Alert />
          <span>
            {__(getText())} <strong>{option.left}</strong>!
          </span>
        </>
      )}
    </StyledCounter>
  );
};
