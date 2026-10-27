import React from 'react';
import styled from 'styled-components';

import { __ } from 'src/helpers/i18n';
import { getColorForBackground } from 'src/utils/color';

interface Props {
  value: string;
  order: number;
  current: boolean;
  done: boolean;
}

const ItemWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing,
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledItem = styled('div')<{ current: boolean; done: boolean }>(
  ({ done, current, theme }) => ({
    borderRadius: '50%',
    width: theme.spacing * 6,
    height: theme.spacing * 6,
    display: 'flex',
    fontSize: 12,
    alignItems: 'center',
    justifyContent: 'center',
    background:
      done || current ? theme.colors.primary : theme.colors.background.primary,
    border:
      done || current
        ? `1px solid ${theme.colors.primary}`
        : `1px solid ${theme.colors.icon.grey.tertiary}`,
    color:
      done || current
        ? getColorForBackground(theme.colors.primary)
        : theme.colors.icon.grey.tertiary,
  }),
);

// const StyledItem = styled.div<{ current?: boolean; done?: boolean }>`
// background: #fff;
// color: #eee;
// border: 1
// ${props => props.current && css`
// color: #fff;
// background: ${props => props.theme.colors.primary};
// color: ${props => getColorForBackground(props.theme.colors.primary)};
// border: 2px solid${props => props.theme.colors.primary};
// `}

// ${props => props.done && css`
// color: #fff;
// background: ${props => props.theme.colors.primary};
// color: ${props => getColorForBackground(props.theme.colors.primary)};
// border: 2px solid${props => props.theme.colors.primary};
// `}
// `

const ItemDescription = styled('div')<{ done: boolean; current: boolean }>(
  ({ theme, done, current }) => ({
    fontWeight: 500,
    color:
      done || current
        ? theme.colors.text.primary
        : theme.colors.icon.grey.primary,
  }),
);

export const Item = ({ value, order, done, current }: Props) => {
  return (
    <ItemWrapper>
      <StyledItem done={done} current={current} className="item-icon">
        {done ? <span className="fa fa-check" /> : order}
      </StyledItem>
      <ItemDescription done={done} current={current}>
        {__(value)}
      </ItemDescription>
    </ItemWrapper>
  );
};
