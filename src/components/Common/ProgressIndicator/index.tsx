import React, { Component } from 'react';

import Item from './Item';
import Bar from './Bar';

import './ProgressIndicator.scss';

interface RenderData {
  value: number;
  desc: string;
}

interface Props {
  data: RenderData[];
  current: number;
}

class ProgressIndicator extends Component<Props> {
  render() {
    const { data, current } = this.props;
    return (
      <div className="progress-indicator-wrapper">
        {data.map((data: RenderData) => (
          <div className="single-stamp">
            <Item value={data.desc} order={data.value} current={data.value === current} done={data.value < current} />
            <Bar done={data.value < current} current={data.value === current} />
          </div>
        ))}
      </div>
    );
  }
}

export default ProgressIndicator;
