import React from 'react';

import './Row.scss';

interface Props {
  label: string;
  content: string | number;
}

const index = ({ label, content }: Props) => (
  <div className="row">
    <p className="row-label">{label}:</p>
    <strong className="row-content">{content || 'Brak'}</strong>
  </div>
);

export default index;
