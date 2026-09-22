import React, { useEffect, useState } from 'react';
import {
  AdminRentListDetails,
  RentDescription,
  RentDetailsRes,
} from 'smartbox-types';

import { RentHistory } from '../../../../../../RentHistory';
import ApiService from '../../../../../../../../services/api-service';
import { Spinner } from '../../../../../../../../components/Branded';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { RentSummary } from '../../../../../../../../components/Common/RentSummary/RentSummary';

interface Props {
  description: RentDescription[];
  rent: AdminRentListDetails;
}

export const RentHistoryModal = ({ description, rent }: Props) => {
  const [fullRent, setFullRent] = useState<RentDetailsRes>();

  const getRentDetails = async () => {
    await ApiService.callFetch(
      'GET',
      `rent/details/${rent.id}`,
      (data: RentDetailsRes) => {
        setFullRent(data);
      },
    );
  };

  useEffect(() => {
    getRentDetails();
  }, []);

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
