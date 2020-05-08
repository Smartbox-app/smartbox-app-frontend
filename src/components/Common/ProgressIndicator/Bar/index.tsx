import React, { Component } from 'react';

import './Bar.scss';

interface Props {
  current: number;
  done: number;
}

class Bar extends Component<Props> {
  render() {
    const { current, done } = this.props;
    console.log('Bar.current', current);
    console.log('Bar.done', done);
    return (
      <div className="bar-wrapper">
        <div className={`bar ${done <= current ? 'bar-current' : ''} ${done < current ? 'bar-done' : ''}`} />
      </div>
    );
  }
}

export default Bar;
