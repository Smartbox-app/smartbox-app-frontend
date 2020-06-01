import React from 'react';

import Content from './Content';
import Controls from '../Controls';

import './AgreementWrapper.scss';

const AgreementWrapper = () => {
  const desktop = window.matchMedia('(min-width: 920px)').matches;
  return (
    <>
      <div className="order-agreement-wrapper">
        <Content />
      </div>
      <Controls isAccepted={false} />
    </>
  );
};

export default AgreementWrapper;
