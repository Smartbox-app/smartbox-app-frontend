import React from 'react';

import './FieldsGrid.scss';

interface Props {
  children: React.ReactNode;
  checkBoxFull?: boolean;
}

const FieldsGrid = ({ children }: Props) => <div className="fields-grid">{children}</div>;

export default FieldsGrid;
