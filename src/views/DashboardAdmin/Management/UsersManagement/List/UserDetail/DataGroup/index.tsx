import React from 'react';

import './DataGroup.scss';

interface Props {
  rowData: string[];
  icon: string;
  title: string;
}

const DataGroup = ({ rowData, icon, title }: Props) => {
  const data = rowData.map((text: any) => <p>{text || "......"}</p>);

  return (
    <div className="single-address">
      <h4>{title}:</h4>

      <div className="content">
        <div className="single-address-logo">
          <i className={`fa ${icon}`} aria-hidden="true" />
        </div>
        <div className="single-address-content">{data}</div>
      </div>
    </div>
  );
};

export default DataGroup;
