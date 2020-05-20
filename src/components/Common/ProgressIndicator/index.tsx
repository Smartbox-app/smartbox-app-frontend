import React from 'react';
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

const ProgressIndicator = ({ data, current }: Props) => {
  const dataToDisplay = data.map((single: RenderData, key: number) => (
    <div className="single-stamp" key={key}>
      <Item value={single.desc} order={single.value} current={single.value === current} done={single.value < current} />
      {key !== 4 && <Bar done={single.value} current={current} />}
    </div>
  ));
  return <div className="progress-indicator-wrapper">{dataToDisplay}</div>;
};

export default ProgressIndicator;
