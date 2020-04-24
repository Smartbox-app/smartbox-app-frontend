import React, { Component } from 'react';

import './Item.scss';

interface Props {
  value: string;
  order: number;
  current?: boolean;
  done?: boolean;
}

class Item extends Component<Props> {
  render() {
    const { value, order, done, current } = this.props;
    return (
      <div className="ittem-wrapper">
        <div className={`item-icon ${done ? 'item-done' : ''} ${current ? 'item-current' : ''}`}>
          {done ? <span className="fa fa-check" /> : order}
        </div>
        <div className="item-description">{value}</div>
      </div>
    );
  }
}

export default Item;
