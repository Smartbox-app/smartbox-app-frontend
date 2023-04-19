import React from 'react';
import { Button } from '../../../../../../components/Common';

import './Controls.scss';

interface Props {
  isAccepted: boolean;
}

const Controls = ({ isAccepted }: Props) => (
  <div className="controls-wrapper">
    {isAccepted ? (
      <Button text='application.acceptConditions' primary big rounded />
    ) : (
      <Button text="" success big rounded onlyIcon icon="check.svg" />
    )}
  </div>
);

export default Controls;
