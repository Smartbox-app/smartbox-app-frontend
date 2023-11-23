import React, { Component } from 'react';

import './Item.scss';
import { __ } from "../../../../helpers/i18n";
import styled, { css } from 'styled-components';

interface Props {
  value: string;
  order: number;
  current?: boolean;
  done?: boolean;
}

const StyledCurrentItem = styled.div<{ current?: boolean; done?: boolean }>`
background: #fff;
color: #eee;
${props => props.current && css`
color: #ddd;
background: ${props => props.theme.colors.primary};
border: 2px solid${props => props.theme.colors.primary};
`}
`

class Item extends Component<Props> {
  render() {
    const { value, order, done, current } = this.props;
    return (
      <div className="item-wrapper">
        <StyledCurrentItem done={done} current={current} className={`item-icon`}>
          {done ? <span className="fa fa-check" /> : order}
        </StyledCurrentItem>
        <div className="item-description">{__(value)}</div>
      </div>
    );
  }
}

export default Item;
