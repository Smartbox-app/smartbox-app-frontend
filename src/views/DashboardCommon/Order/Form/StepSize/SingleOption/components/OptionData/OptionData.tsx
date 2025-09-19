import { BoxGroupUserRes } from 'smartbox-types';
import { colorOrDark } from 'src/utils/color';
import styled from 'styled-components';

const StyledSizeContainer = styled('div')<{ disabled?: boolean }>(
  ({ theme, disabled }) => ({
    backgroundColor: theme.colors.background.secondary,
    width: '100%',
    borderRadius: theme.radius.innerSurface,
    textAlign: 'center',
    opacity: disabled ? 0.5 : 1,
    padding: `${theme.spacing * 2}px ${theme.spacing * 4}px`,
  }),
);

const StyledAreaVolumeContainer = styled.div<{ disabled?: boolean }>`
  background-color: transparent;
  color: ${(props) =>
    props.disabled
      ? props.theme.colors.disabled
      : colorOrDark(props.theme.colors.primary)};
  text-align: center;
`;

export type OptionDataProps = {
  option: BoxGroupUserRes;
  disable?: boolean;
};

export const OptionData = ({ option, disable }: OptionDataProps) => {
  return (
    <>
      {(option.volume || option.area) && (
        <StyledAreaVolumeContainer disabled={!option.available || disable}>
          {option.area ? (
            <p>
              Powierzchnia: <strong>{option.area}m²</strong>
            </p>
          ) : null}
          {option.volume ? (
            <p>
              Objętość: <strong>{option.volume}m³</strong>
            </p>
          ) : null}
        </StyledAreaVolumeContainer>
      )}
      {option.height && option.width && option.depth ? (
        <StyledSizeContainer disabled={!option.available || disable}>
          sz. <strong>{option.width}m</strong> x gł.{' '}
          <strong>{option.depth}m</strong> x wys.{' '}
          <strong>{option.height}m</strong>
        </StyledSizeContainer>
      ) : null}
    </>
  );
};
