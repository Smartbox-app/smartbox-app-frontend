import React from 'react';
import Status from './Status';
import Position from './Position';

interface Props {
  selectedBoxId: string;
}

const Edit = (props: Props) => {
  const { selectedBoxId } = props;
  return (
    <div>
      <p>Poniższe zmiany są nieodwracalne!</p>
      <Status selectedBoxId={selectedBoxId} />
      <Position selectedBoxId={selectedBoxId} rentId="6af51d59-9c06-4704-bb5a-374de61726a2" />
    </div>
  );
};

export default Edit;
