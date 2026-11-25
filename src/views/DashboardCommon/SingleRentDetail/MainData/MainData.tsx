import React from 'react';
import { useSelector } from 'react-redux';

import { MyRentDetails, RentStatus } from 'smartbox-types';
import { Alert } from 'src/components/Common';
import { UserStockMap } from 'src/components/Common/UserStockMap';
import { Section } from 'src/components/ui';
import { ApplicationState } from 'src/reducers';

import Action from '../Action';
import Details from '../Details';
import { OpenEndedNextPrice } from '../OpenEndedNextPrice';

export type MainDataProps = {
  singleRent: MyRentDetails;
  isAuthorizedViewer: boolean;
};

export const MainData = ({ singleRent, isAuthorizedViewer }: MainDataProps) => {
  const showUserStockMap = useSelector(
    (state: ApplicationState) => state.rent.showUserStockMap,
  );

  const restrictedAccess = singleRent?.status === RentStatus.pendingFinish;

  if (restrictedAccess) {
    return (
      <Section>
        <Alert type="notice" text="application.boxIsPendingFinish" />
      </Section>
    );
  }

  return (
    <Section>
      <Action rent={singleRent} isAuthorizedViewer={isAuthorizedViewer} />

      {!showUserStockMap ? (
        <Details singleRent={singleRent} />
      ) : (
        <UserStockMap
          boxId={singleRent.boxId}
          boxNumber={singleRent.boxNumber}
          boxAdditionalInfo={singleRent.boxAdditionalInfo}
          stockId={singleRent.stockId}
        />
      )}
      {singleRent.nextPeriodPreview ? (
        <OpenEndedNextPrice preview={singleRent.nextPeriodPreview} />
      ) : null}
    </Section>
  );
};
