import React from 'react';

import './Bar.scss';
import styled from 'styled-components';

interface Props {
  current: number;
  done: number;
}

const StyledBar = styled('div')<{ done: boolean }>(({ done, theme }) => ({
  background: done ? theme.colors.primary : theme.colors.border.primary,
}));

export const Bar = ({ current, done }: Props) => {
  return (
    <div className="bar-wrapper">
      <StyledBar
        done={done < current}
        className={`bar ${done <= current ? 'bar-current' : ''}`}
      />
    </div>
  );
};
