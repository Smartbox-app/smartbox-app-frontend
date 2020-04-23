import React, { Component } from 'react';

import './Bar.scss';

interface Props {
  current?: boolean;
  done?: boolean;
}

class Bar extends Component<Props> {
  render() {
    const { current, done } = this.props;
    return (
      <div className="bar-wrapper">
        <div className={`bar ${done ? 'bar-done' : ''}`} />
      </div>
    );
  }
}

export default Bar;
