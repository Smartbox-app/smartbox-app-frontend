import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { setOrderStock } from 'src/actions/order';
import { Badge, Card, Typography } from 'src/components/ui';
import { ApplicationState } from 'src/reducers';

import './SingleOption.scss';

interface Props {
  name: string;
  value: string;
  address: string;
  disable?: boolean;
}

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

const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  flexDirection: 'column',
  gap: theme.spacing * 2,
  flex: 1,
}));

export const SingleOption = ({ name, address, value, disable }: Props) => {
  const [isHovered, setHovered] = useState(false);

  const handleHover = () => {
    setHovered(true);
  };

  const handleBlur = () => {
    setHovered(false);
  };
  const dispatch = useDispatch();
  const stockId = useSelector((state: ApplicationState) => state.order.stockId);

  const selectOption = () => {
    dispatch(setOrderStock(value, name, address));
  };

  return (
    <StyledSingleOption onMouseEnter={handleHover} onMouseLeave={handleBlur}>
      <label
        htmlFor={value}
        className={`single-stock-option ${disable ? 'single-stock-option-disable' : ''}`}
      >
        <input
          name="stock"
          type="radio"
          value={value}
          id={value}
          checked={value === stockId}
          onChange={selectOption}
          disabled={disable}
        />

        <Card hovered={isHovered} active={value === stockId} disabled={disable}>
          <Content>
            <Badge bold variant={value === stockId ? 'primary' : 'default'}>
              {name}
            </Badge>

            <Typography>{address}</Typography>
          </Content>
        </Card>
      </label>
    </StyledSingleOption>
  );
};
