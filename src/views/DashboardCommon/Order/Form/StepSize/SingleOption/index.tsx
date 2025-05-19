import React, { ChangeEvent, useState } from 'react';

import './SingleOption.scss';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';
import { Spinner } from '../../../../../../components/Branded';
import styled, { css, DefaultTheme } from 'styled-components';
import { BoxGroupUserRes } from 'smartbox-types';
import ApiService from '../../../../../../services/api-service';
import { PriceInfo } from '../PriceInfo';
import { setBoxGroup, setMinRentPeriod } from '../../../../../../actions/order';
import {
  colorOrDark,
  getColorForBackground,
} from '../../../../../../utils/color';
import { Card } from 'src/components/ui';

export type SingleOptionType = {
  name: string;
  value: string;
  id: string;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  imgAddress?: string;
};

interface Props {
  singleOptionData: BoxGroupUserRes;
  disable?: boolean;
}

const StyledSingleOptionWrapper = styled.div<{ available: boolean }>`
  position: relative;
  input[type='radio']:checked + .single-option {
    .radio-img {
      border: 2px solid ${(props) => props.theme.colors.secondary};
    }
  }

  ${(props) =>
    !props.available &&
    css`
      cursor: not-allowed;

      .radio-img {
        opacity: 0.2;
      }
    `}
`;

const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  textAlign: 'center',
  flexDirection: 'column',
  gap: theme.spacing * 2,
  flex: 1,
  width: '100%'
}));

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

const StyledImageValue = styled.span`
  color: ${(props) => colorOrDark(props.theme.colors.primary)};
  z-index: 1;
`;

const StyledSingleOption = styled('div')({
  flex: 1,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  "input[type='radio']": {
    display: 'none',
  },
  '@media(min-width: 768px)': {
    flex: '0 1 calc(50% - 8px)',
  },
  '@media(min-width: 800px)': {
    flex: '0 1 calc(33% - 8px)',
  },
});

const getColor = (active: boolean, disabled: boolean, theme: DefaultTheme) => {
  if (active) return getColorForBackground(theme.colors.primary);
  if (disabled) return theme.colors.border.disable;
  return theme.colors.text.primary;
};

const StyledOptionSize = styled('div')<{
  active?: boolean;
  disabled?: boolean;
}>(({ theme, active, disabled }) => ({
  position: 'absolute',
  minWidth: theme.spacing * 8,
  height: theme.spacing * 8,
  top: theme.spacing * 3,
  right: theme.spacing * 3,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  padding: theme.spacing * 2,
  border: active
    ? `1px solid ${theme.colors.primary}`
    : `1px solid ${theme.colors.border.primary}`,
  background: active ? theme.colors.primary : theme.colors.background.primary,
  color: getColor(active || false, disabled || false, theme),
  borderRadius: theme.spacing * 4,
}));

const SingleOption = ({ singleOptionData, disable }: Props) => {
  const [isHovered, setHovered] = useState(false);

  const handleHover = () => {
    setHovered(true);
  };

  const handleBlur = () => {
    setHovered(false);
  };
  const dispatch = useDispatch();
  const loading = useSelector(
    (state: ApplicationState) => state.spinner.loading,
  );
  const boxGroupId = useSelector(
    (state: ApplicationState) => state.order.boxGroupId,
  );

  const selectOption = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setBoxGroup(singleOptionData.id, singleOptionData.name));
    dispatch(setMinRentPeriod(singleOptionData.minRentPeriod));
  };

  if (loading) return <Spinner />;
  return (
    <StyledSingleOption onMouseEnter={handleHover} onMouseLeave={handleBlur}>
      <label htmlFor={singleOptionData.id}>
        <Card
          disabled={!singleOptionData.available || disable}
          hovered={isHovered}
          active={singleOptionData.id === boxGroupId}
        >
          <Content>
            <StyledOptionSize
              active={singleOptionData.id === boxGroupId}
              disabled={!singleOptionData.available || disable}
            >
              {singleOptionData.name}
            </StyledOptionSize>
            <input
              name={singleOptionData.name}
              type="radio"
              value={singleOptionData.id}
              id={singleOptionData.id}
              checked={singleOptionData.id === boxGroupId}
              onChange={selectOption}
              disabled={!singleOptionData.available}
            />
            {singleOptionData.image ? (
              <div className="svg-wrapper">
                <img
                  src={`${ApiService.url}box-group-new/image/${singleOptionData.id}`}
                  alt={singleOptionData.name}
                />
              </div>
            ) : (
              <span />
            )}

            {(singleOptionData.volume || singleOptionData.area) && (
              <StyledAreaVolumeContainer
                disabled={!singleOptionData.available || disable}
              >
                {singleOptionData.area ? (
                  <p>
                    Powierzchnia: <strong>{singleOptionData.area}m²</strong>
                  </p>
                ) : null}
                {singleOptionData.volume ? (
                  <p>
                    Objętość: <strong>{singleOptionData.volume}m³</strong>
                  </p>
                ) : null}
              </StyledAreaVolumeContainer>
            )}
            {singleOptionData.height &&
            singleOptionData.width &&
            singleOptionData.depth ? (
              <StyledSizeContainer
                disabled={!singleOptionData.available || disable}
              >
                sz. <strong>{singleOptionData.width}m</strong> x gł.{' '}
                <strong>{singleOptionData.depth}m</strong> x wys.{' '}
                <strong>{singleOptionData.height}m</strong>
              </StyledSizeContainer>
            ) : null}

            <PriceInfo
              box={singleOptionData}
              disabled={!singleOptionData.available || disable}
              active={singleOptionData.id === boxGroupId}
            />
          </Content>
        </Card>
      </label>
    </StyledSingleOption>
  );
  return (
    <StyledSingleOptionWrapper
      available={singleOptionData.available}
      className="single-option-wrapper"
    >
      <StyledImageValue
        className={`img-value ${disable ? 'img-value-disabled' : ''}`}
      >
        {!singleOptionData.available ? 'BRAK' : ''}
      </StyledImageValue>
    </StyledSingleOptionWrapper>
  );
};

export default SingleOption;
