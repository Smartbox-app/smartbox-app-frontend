import React from 'react';

import Content from './Content';

import './AgreementWrapper.scss';

const AgreementWrapper = () => (
  <>
    <div className="order-agreement-wrapper">
      <Content />
    </div>
    {/* <Controls isAccepted={false} /> */}
  </>
);

export default AgreementWrapper;
