import React from 'react';

import {
  AdminRentListDetails,
  RentAgreementType,
  RentDescription,
} from 'smartbox-types';
import { Spinner } from 'src/components/Branded';
import { RentSummary } from 'src/components/Common/RentSummary/RentSummary';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useRentDetailsQuery } from 'src/queries';
import { RentHistory } from 'src/views/DashboardCommon/RentHistory';

interface Props {
  description: RentDescription[];
  rent: AdminRentListDetails;
}

export const RentHistoryModal = ({ description, rent }: Props) => {
  const { data: fullRent } = useRentDetailsQuery(rent.id);

  return (
    <>
      <Modal.Header title={__('application.rentHistory')} />
      <Modal.Content>
        <RentSummary rent={rent} />
        {fullRent ? (
          <RentHistory
            description={description}
            rentId={fullRent.id}
            paymentType={fullRent.paymentType}
            isOpenEnded={fullRent.agreementType === RentAgreementType.OpenEnded}
            periods={fullRent.periods}
            decisionFinishAt={fullRent.decisionFinishAt}
          />
        ) : (
          <Spinner />
        )}
      </Modal.Content>
    </>
  );
};
