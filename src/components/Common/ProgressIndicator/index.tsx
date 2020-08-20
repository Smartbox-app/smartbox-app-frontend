import React from 'react';
import Item from './Item';
import Bar from './Bar';

import './ProgressIndicator.scss';

interface SingleStep {
  value: number;
  desc: string;
}

interface Props {
  stepList: SingleStep[];
  current: number;
}

const ProgressIndicator = ({ stepList, current }: Props) => {
  const dataToDisplay = stepList.map((singleStep: SingleStep, key: number) => (
    <div className="single-stamp" key={key}>
      <Item
        value={singleStep.desc}
        order={singleStep.value}
        current={singleStep.value === current}
        done={singleStep.value < current}
      />
      {key !== stepList.length - 1 && <Bar done={singleStep.value} current={current} />}
    </div>
  ));
  return <div className="progress-indicator-wrapper">{dataToDisplay}</div>;
};

export default ProgressIndicator;
