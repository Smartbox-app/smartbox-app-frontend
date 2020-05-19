import React from 'react';
import Status from './Status';

interface Props {
  selectedBoxId: number | string;
}

function Edit(props: Props) {
  const { selectedBoxId } = props;
  return (
    <div>
      <p>Poniższe zmiany są nie odwracalne!!</p>
      <Status selectedBoxId={selectedBoxId} />
    </div>
  );
}

export default Edit;
