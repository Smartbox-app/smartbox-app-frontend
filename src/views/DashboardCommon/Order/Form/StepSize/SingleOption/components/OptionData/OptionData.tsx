import { BoxGroupUserRes } from 'smartbox-types';
import { Area, Cube } from 'src/icons';
import { colorOrDark } from 'src/utils/color';
import styled from 'styled-components';

// const StyledSizeContainer = styled('div')<{ disabled?: boolean }>(
//   ({ theme, disabled }) => ({
//     width: '100%',
//     opacity: disabled ? 0.5 : 1,
//   }),
// );

const StyledAreaVolumeContainer = styled.div<{ disabled?: boolean }>`
  background-color: transparent;
  color: ${(props) =>
    props.disabled
      ? props.theme.colors.disabled
      : colorOrDark(props.theme.colors.primary)};
  text-align: center;
`;

const StyledSizeDataContainer = styled('div')<{ disabled?: boolean }>(
  ({ theme, disabled }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing * 2,
    color: colorOrDark(theme.colors.primary),
    svg: {
      fill: colorOrDark(theme.colors.primary),
    },
    opacity: disabled ? 0.5 : 1,
  }),
);

const StyledSingleInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing,
  fontSize: '0.9rem',
}));
const StyledInfoGroup = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing * 2,
}));

export type OptionDataProps = {
  option: BoxGroupUserRes;
  disable?: boolean;
};

export const OptionData = ({ option, disable }: OptionDataProps) => {
  return (
    <>
      <StyledSizeDataContainer disabled={!option.available || disable}>
        <StyledInfoGroup>
          {option.area ? (
            <StyledSingleInfo disabled={!option.available || disable}>
              <Area />
              <strong>{option.area}m²</strong>
            </StyledSingleInfo>
          ) : null}
          {option.volume ? (
            <StyledSingleInfo disabled={!option.available || disable}>
              <Cube /> <strong>{option.volume}m³</strong>
            </StyledSingleInfo>
          ) : null}
        </StyledInfoGroup>
        {option.height && option.width && option.depth ? (
          <StyledSingleInfo>
            sz. <strong>{option.width}m</strong> x gł.{' '}
            <strong>{option.depth}m</strong> x wys.{' '}
            <strong>{option.height}m</strong>
          </StyledSingleInfo>
        ) : null}
      </StyledSizeDataContainer>
    </>
  );
};
