import React from 'react';

interface Props {
  selectedBoxId: number | string;
}

const BoxDetail = ({ selectedBoxId }: Props) => {
  console.log('BoxDetail');
  return <div>BoxDetail - {selectedBoxId}</div>;
};

export default BoxDetail;
