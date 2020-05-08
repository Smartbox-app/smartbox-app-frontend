import React from 'react';

import Item from './Item';

import './ProgressIndicator.scss';
import Bar from './Bar';

interface RenderData {
  value: number;
  desc: string;
}

interface Props {
  data: RenderData[];
  current: number;
}

const ProgressIndicator = ({ data, current }: Props) => {
  const dataToDisplay = data.map((data: RenderData, key: number) => (
    <div className="single-stamp" key={key}>
      <Item value={data.desc} order={data.value} current={data.value === current} done={data.value < current} />
      {key !== 3 && <Bar done={data.value} current={current} />}
    </div>
  ));
  return (
    <div className="progress-indicator-wrapper">
      {dataToDisplay}
      {/* <Bar done={data.value - 1} current={data.value} /> */}
    </div>
  );
};

export default ProgressIndicator;
