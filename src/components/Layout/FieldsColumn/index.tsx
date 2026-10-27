import React from 'react';

import './FieldsColumn.scss';

interface Props {
  children: React.ReactNode;
}

const FieldsColumn = ({ children }: Props) => <div className="fields-column">{children}</div>;

export default FieldsColumn;
