import React from 'react';

import './SingleDepartment.scss';

interface Props {
  name: string;
  phone: string;
  mail: string;
  organisationRole: string;
}

const SingleDepartment = ({ name, phone, mail, organisationRole }: Props) => (
  <div className="department">
    <div className="content">
      <p className="department-row main">
        <strong>{name}</strong>
      </p>
      <p className="department-row organisation-role">{organisationRole}</p>
      <p className="department-row clickable">
        <span className="fa fa-envelope-o" />
        <a href={`mailto:${mail}`} rel="noopener noreferrer" target="_blank">
          {mail}
        </a>
      </p>
      <p className="department-row clickable">
        <span className="fa fa-mobile" />
        <a href={`tel:${phone}`}>{phone}</a>
      </p>
    </div>
    <div className="detail">
      <div className="detail-color" />
    </div>
  </div>
);

export default SingleDepartment;
