import React from 'react';
import { SingleStorageType } from '../index';

import './SingleStorage.scss';

interface Props {
  single: SingleStorageType;
}

const SingleStorage = ({ single }: Props) => (
  <div className="single-wrapper">
    <div className="storage">
      <p className="main-info">{single.size}m2</p>
      <p className="sec-info">{single.location}</p>
    </div>
  </div>
);

export default SingleStorage;
