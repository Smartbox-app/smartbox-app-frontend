import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import styled, { DefaultTheme } from 'styled-components';

import { BoxGroupUserRes } from 'smartbox-types';
import { setPendingCheckout } from 'src/actions/order';
import { Spinner } from 'src/components/Branded';
import { Card } from 'src/components/ui';
import { history } from 'src/history';
import { ApplicationState } from 'src/reducers';
import {
  getColorForBackground,
} from 'src/utils/color';
import { PriceInfo } from 'src/views/DashboardCommon/Order/Form/StepSize/PriceInfo';

import { LeftCounter } from './components/LeftCounter';
import { OptionActions } from './components/OptionActions';
import { OptionData } from './components/OptionData';
import { OptionImage } from './components/OptionImage';

import './SingleOption.scss';

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
  minHeight: 450,
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
  height: theme.spacing * 10,
  top: theme.spacing * 4,
  right: theme.spacing * 4,
  display: 'inline-block',
  fontWeight: 700,
  padding: `${theme.spacing * 2}px ${theme.spacing * 4}px`,
  border: active
    ? `1px solid ${theme.colors.primary}`
    : `1px solid ${theme.colors.border.primary}`,
  background: active ? theme.colors.primary : theme.colors.background.primary,
  color: getColor(active || false, disabled || false, theme),
  borderRadius: theme.spacing * 5,
  fontSize: '0.9rem',
  maxWidth: 150,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  lineHeight: '22px'
}));

const StyledCardBottom = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing * 2,
  width: '100%',
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
  const { search } = useLocation();
  const loading = useSelector(
    (state: ApplicationState) => state.spinner.loading,
  );
  const selectedGroupId = new URLSearchParams(search).get('group');
  const selected =
    selectedGroupId === singleOptionData.id && singleOptionData.available;

  const selectOption = () => {
    if (!singleOptionData.available) return;
    const params = new URLSearchParams(history.location.search);
    params.set('group', singleOptionData.id);
    history.replace({
      pathname: history.location.pathname,
      search: `?${params.toString()}`,
    });
    dispatch(setPendingCheckout(null));
  };

  if (loading) return <Spinner />;
  return (
    <StyledSingleOption onMouseEnter={handleHover} onMouseLeave={handleBlur}>
      <label htmlFor={singleOptionData.id}>
        <Card
          disabled={!singleOptionData.available || disable}
          hovered={isHovered}
          active={selected}
        >
          <Content>
            <StyledOptionSize
              active={selected}
              disabled={!singleOptionData.available || disable}
            >
              {singleOptionData.name}
            </StyledOptionSize>
            <LeftCounter
              option={singleOptionData}
              disabled={!singleOptionData.available || disable}
            />
            <input
              name={singleOptionData.name}
              type="radio"
              value={singleOptionData.id}
              id={singleOptionData.id}
              checked={selected}
              onChange={selectOption}
              disabled={!singleOptionData.available}
            />
            <span />
            <OptionImage option={singleOptionData} />
            <StyledCardBottom>
              <OptionData option={singleOptionData} disable={disable} />

              <PriceInfo
                box={singleOptionData}
                disabled={!singleOptionData.available || disable}
                active={selected}
              />
              <OptionActions option={singleOptionData} onSelectOption={selectOption}/>
            </StyledCardBottom>
          </Content>
        </Card>
      </label>
    </StyledSingleOption>
  );
};

export default SingleOption;
