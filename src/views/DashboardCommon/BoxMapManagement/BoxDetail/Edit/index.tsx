import React from 'react';
import Status from './Status';
import Position from './Position';
import { __ } from '../../../../../../helpers/i18n';

interface Props {
  selectedBoxId: string;
}

const Edit = (props: Props) => {
  const { selectedBoxId } = props;
  return (
    <div>
      <p>{__('application.changesIrreversible')}</p>
      <Status selectedBoxId={selectedBoxId} />
      <Position selectedBoxId={selectedBoxId} rentId="6af51d59-9c06-4704-bb5a-374de61726a2" />
    </div>
  );
};

export default Edit;
