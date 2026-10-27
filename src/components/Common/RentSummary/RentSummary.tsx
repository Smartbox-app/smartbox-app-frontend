import React from 'react';

import { BoxDisplayStatus } from 'smartbox-types';
import { Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { translateBoxDisplayStatus } from 'src/utils/box-display-status';

type RentSummaryOwner = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
};

type RentSummaryRent = RentSummaryOwner & {
  number: string;
  status: BoxDisplayStatus | string;
  owner?: RentSummaryOwner | null;
};

type Props = {
  rent: RentSummaryRent;
};


const formatOwner = (owner: RentSummaryOwner) =>
  [owner.firstName, owner.lastName].filter(Boolean).join(' ') ||
  owner.email ||
  __('application.lack');

export const RentSummary = ({ rent }: Props) => (
  <div>
    <Typography>
      {__('application.rentSummaryNumber')} <strong>{rent.number}</strong>
      {', '}
      {__('application.rentSummaryStatus')}{' '}
      <strong>
        {translateBoxDisplayStatus(rent.status as BoxDisplayStatus)}
      </strong>
      {', '}
      {__('application.rentSummaryOwner')}{' '}
      <strong>{formatOwner(rent.owner ?? rent)}</strong>
    </Typography>
  </div>
);
