import React, { ChangeEvent, useState } from 'react';

import './SingleOption.scss';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';
import { Spinner } from '../../../../../../components/Branded';
import styled, { DefaultTheme } from 'styled-components';
import { BoxGroupUserRes } from 'smartbox-types';
import { PriceInfo } from '../PriceInfo';
import { setBoxGroup, setMaxRentPeriod, setMinRentPeriod } from '../../../../../../actions/order';
import {
  colorOrDark,
  getColorForBackground,
} from '../../../../../../utils/color';
import { Card } from 'src/components/ui';
import { OptionImage } from './components/OptionImage';
import { OptionData } from './components/OptionData';
import { OptionNotification } from './components/OptionNotification';
import { LeftCounter } from './components/LeftCounter';

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

const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  textAlign: 'center',
  flexDirection: 'column',
  gap: theme.spacing * 2,
  flex: 1,
  width: '100%',
}));

const StyledSingleOption = styled('div')({
  flex: 1,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  "input[type='radio']": {
    display: 'none',
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
    dispatch(setBoxGroup(singleOptionData.id, singleOptionData.name, singleOptionData.area ? singleOptionData.area.toString() : ''));
    dispatch(setMinRentPeriod(singleOptionData.minRentPeriod));
    dispatch(setMaxRentPeriod(singleOptionData.maxRentPeriod));
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
            <OptionImage option={singleOptionData} />
            <OptionData option={singleOptionData} disable={disable} />

            <PriceInfo
              box={singleOptionData}
              disabled={!singleOptionData.available || disable}
              active={singleOptionData.id === boxGroupId}
            />
            <OptionNotification option={singleOptionData} />
            <LeftCounter option={singleOptionData} />
          </Content>
        </Card>
      </label>
    </StyledSingleOption>
  );
};

export default SingleOption;
