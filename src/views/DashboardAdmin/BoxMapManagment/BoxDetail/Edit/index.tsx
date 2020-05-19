import React from 'react';
import Status from './Status';

interface Props {}

function Edit(props: Props) {
  const {} = props;
  return (
    <div>
      <p>Poniższe zmiany są nie odwracalne!!</p>
      <Status />
    </div>
  );
}

export default Edit;
