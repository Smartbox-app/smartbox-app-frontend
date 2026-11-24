import { isAfter } from 'date-fns';
import React, { useMemo } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { BoxGroupType } from 'smartbox-types';
import { Description } from './RentDescription';
import { getBoxPasscodeLabel } from 'src/utils/box-group-labels';
import {
  canDisplayRentAccess,
  canUseRentAccessActions,
} from 'src/utils/rent';

import { RentStatus } from 'smartbox-types';
import { Header, PageHeader, Section, Skeleton } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { useMyRentDetailsQuery } from 'src/queries';
import { isRentAccessActive } from 'src/utils/rent';
import Gate from './Gate';
import { MainData } from './MainData';
import { MissingPaymentAlert } from './MissingPaymentAlert';
import { OpenBox } from './OpenBox';
import { PendingPaymentAlert } from './PendingPaymentAlert';
import { PeriodUnpaidAlert } from './PeriodUnpaidAlert';
import { RentAuthorizations } from './RentAuthorizations';
import { RentNote } from './RentNote';

const StyledGatesHeader = styled.div`
  font-weight: 700;
  margin: 0;
`;

const BOX_ICONS: Record<BoxGroupType, string> = {
  [BoxGroupType.storage]: 'fa-cube',
  [BoxGroupType.locker]: 'fa-archive',
  [BoxGroupType.parking]: 'fa-car',
};

const StyledBoxContainer = styled.div`
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  padding-left: 16px;
  padding-right: 16px;
  text-align: center;
  @media (min-width: 768px) {
    text-align: left;
  }
`;

const SingleRentDetail = () => {
  const { getText } = useTenantNaming();
  const { orderId } = useParams<{ orderId: string }>();

  const {
    data: singleRent,
    isPending: loading,
    isError,
  } = useMyRentDetailsQuery(orderId);

  const restrictedAccess = singleRent?.status === RentStatus.pendingFinish;

  const displayAccess = useMemo(
    () => (singleRent ? canDisplayRentAccess(singleRent) : false),
    [singleRent],
  );
  const accessActionsEnabled = useMemo(
    () => (singleRent ? canUseRentAccessActions(singleRent) : false),
    [singleRent],
  );

  if (isError) return <Redirect to="/" />;

  if (loading)
    return (
      <>
        <Skeleton radius={16} height={73} />
        <Skeleton radius={16} height={454} />
        <Skeleton radius={16} height={300} />
      </>
    );
  if (isError || !singleRent) return null;

  const isAuthorizedViewer = singleRent.isAuthorized === true;

  return (
    <>
      <PageHeader>
        {isAuthorizedViewer ? getText('authorized_box') : getText('box')}:{' '}
        {singleRent.boxNumber}
      </PageHeader>
      {!isAuthorizedViewer ? (
        <>
          <PendingPaymentAlert rent={singleRent} />
          <MissingPaymentAlert rent={singleRent} />
          <PeriodUnpaidAlert rent={singleRent} />
        </>
      ) : null}
      <MainData
        singleRent={singleRent}
        isAuthorizedViewer={isAuthorizedViewer}
      />
      {!restrictedAccess ? (
        <Section>
          <Header variant="h2">{__('application.note')}</Header>
          <RentNote rentId={orderId} canEdit={!isAuthorizedViewer} />
        </Section>
      ) : null}
      {displayAccess ? (
        <Section>
          <Header variant="h2">{__('application.access')}</Header>
          {singleRent.gates && singleRent.gates.length > 0 && (
            <StyledGatesHeader>{__('application.gates')}</StyledGatesHeader>
          )}
          {singleRent.gates.map((gate) => (
            <Gate
              key={gate.id}
              gate={gate}
              disabled={!accessActionsEnabled}
            />
          ))}
          {(singleRent.controlled || singleRent.passcode) && (
            <>
              <StyledGatesHeader>{getText('box')}</StyledGatesHeader>
              <StyledBoxContainer>
                <h4>
                  <span
                    className={`fa ${BOX_ICONS[singleRent.boxGroupType] ?? 'fa-cube'}`}
                  />{' '}
                  {singleRent.number}
                </h4>
                {singleRent.passcode ? (
                  <p>
                    <span className="fa fa-lock" />{' '}
                    {getBoxPasscodeLabel(singleRent.boxGroupType)}:{' '}
                    <strong>{singleRent.passcode}</strong>
                  </p>
                ) : null}
                {singleRent.controlled && [RentStatus.rented, RentStatus.awaitingFinish].includes(singleRent.status) ? (
                  <OpenBox
                    id={singleRent.boxId}
                    disabled={!accessActionsEnabled}
                  />
                ) : null}
              </StyledBoxContainer>
            </>
          )}
        </Section>
      ) : null}

      {!isAuthorizedViewer && !restrictedAccess ? (
        <>
          <Section>
            <RentAuthorizations rent={singleRent} />
          </Section>

          <Description
            description={singleRent.description ?? []}
            rent={singleRent}
          />
        </>
      ) : null}
    </>
  );
};

export default SingleRentDetail;
