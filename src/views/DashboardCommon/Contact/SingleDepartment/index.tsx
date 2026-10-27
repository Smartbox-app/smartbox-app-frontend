import React from 'react';

import { Link } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

import './SingleDepartment.scss';

interface Props {
  name: string;
  phone: string;
  mail: string;
  organisationRole: string;
  closeHour?: string;
  openHour?: string;
}

const SingleDepartment = ({
  name,
  phone,
  mail,
  organisationRole,
  closeHour,
  openHour,
}: Props) => (
  <div className="department">
    <div className="content">
      <p className="department-row main">
        <strong>{name ? __(name) : null}</strong>
      </p>
      <p className="department-row organisation-role">
        {organisationRole ? __(organisationRole) : null}{' '}
        {closeHour && (
          <>
            <br />{' '}
            <strong>
              {openHour} - {closeHour}
            </strong>
          </>
        )}
      </p>
      <p className="department-row clickable">
        <span className="fa fa-envelope-o" />
        <Link href={`mailto:${mail}`} rel="noopener noreferrer" target="_blank">
          {mail}
        </Link>
      </p>
      {phone && (
        <p className="department-row clickable">
          <span className="fa fa-mobile" />
          <Link href={`tel:${phone}`}>{phone}</Link>
        </p>
      )}
    </div>
    <div className="detail">
      <div className="detail-color" />
    </div>
  </div>
);

export default SingleDepartment;
