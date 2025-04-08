import React, { ChangeEvent, ChangeEventHandler, useState } from 'react';
import { ReactSVG } from 'react-svg';

import './SingleOption.scss';
import { connect, useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';
import { Spinner } from '../../../../../../components/Branded';
import styled from 'styled-components';
import { setOrderStock } from '../../../../../../actions/order';
import { Badge, Card, Typography } from 'src/components/ui';

interface Props {
  loading: boolean;
  name: string;
  value: string;
  address: string;
  disable?: boolean;
}

const StyledSingleOption = styled('div')({
  flex: 1,
  cursor: 'pointer',
  "input[type='radio']": {
    display: 'none',
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

const SingleOption = ({ name, address, value, disable, loading }: Props) => {
  const [isHovered, setHovered] = useState(false);

  const handleHover = () => {
    setHovered(true);
  };

  const handleBlur = () => {
    setHovered(false);
  };
  const dispatch = useDispatch();
  const stockId = useSelector((state: ApplicationState) => state.order.stockId);

  const selectOption = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setOrderStock(value, name, address));
  };

  if (loading) return <Spinner />;
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

const mapStateToProps = (state: ApplicationState) => ({
  loading: state.spinner.loading,
});

export default connect(mapStateToProps)(SingleOption);
