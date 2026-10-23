import React from 'react';
import {
  AdminRentListDetails,
  RentAgreementType,
  RentDescription,
} from 'smartbox-types';

import { RentHistory } from '../../../../../../RentHistory';
import { Spinner } from '../../../../../../../../components/Branded';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { RentSummary } from '../../../../../../../../components/Common/RentSummary/RentSummary';
import { useRentDetailsQuery } from 'src/queries';

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
