import React, { useMemo } from 'react';
import { withRouter, RouteComponentProps, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { RentStatus } from 'smartbox-types';
import { Spinner } from '../../../components/Branded';
import { UserStockMap } from '../../../components/Common/UserStockMap';

import { ApplicationState } from '../../../reducers';

import Action from './Action';
import Details from './Details';
import Gate from './Gate';
import { MissingPaymentAlert } from './MissingPaymentAlert';
import { OpenBox } from './OpenBox';
import styled from 'styled-components';
import { Description } from './RentDescription';
import { isAfter } from 'date-fns';
import { Header, PageHeader, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { PeriodUnpaidAlert } from './PeriodUnpaidAlert';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { PendingPaymentAlert } from './PendingPaymentAlert';
import { RentAuthorizations } from './RentAuthorizations';
import { useMyRentDetailsQuery } from 'src/queries';

interface RouteProps {
  orderId: string;
}
interface Props extends RouteComponentProps<RouteProps> {
  showUserStockMap: boolean;
}

const StyledGatesHeader = styled.div`
  font-weight: 700;
  margin: 0;
`;

const StyledBoxContainer = styled.div`
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  padding-left: 16px;
  padding-right: 16px;
  text-align: center;
  @media (min-width: 768px) {
    text-align: left;
  }
`;

const SingleRentDetail = ({ showUserStockMap, match }: Props) => {
  const { getText } = useTenantNaming();
  const { orderId } = useParams<{ orderId: string }>();

  const {
    data: singleRent,
    isPending: loading,
    isError,
  } = useMyRentDetailsQuery(orderId);

  const displayAccess = useMemo(() => {
    if (!singleRent) return false;

    if (singleRent.status !== RentStatus.rented) return false;

    const currentDate = new Date();

    if (isAfter(new Date(singleRent.startAt), currentDate)) return false;
    if (isAfter(currentDate, new Date(singleRent.finishAt))) return false;

    return true;
  }, [singleRent]);

  if (loading) return <Spinner />;
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
      <Section>
        <Action rent={singleRent} isAuthorizedViewer={isAuthorizedViewer} />
        {!showUserStockMap ? (
          <>
            <Details singleRent={singleRent} />
          </>
        ) : (
          <UserStockMap
            boxId={singleRent.boxId}
            boxNumber={singleRent.boxNumber}
            boxAdditionalInfo={singleRent.boxAdditionalInfo}
            stockId={singleRent.stockId}
          />
        )}
      </Section>

      {displayAccess ? (
        <Section>
          <Header variant="h2">{__('application.access')}</Header>
          {singleRent.passcode ? (
            <div>
              <Header variant="h3">{__('application.passcode')}</Header>
              <strong>{singleRent.passcode}</strong>
            </div>
          ) : null}
          {singleRent.gates && singleRent.gates.length > 0 && (
            <StyledGatesHeader>Bramy</StyledGatesHeader>
          )}
          {singleRent.gates.map((gate) => (
            <Gate key={gate.id} gate={gate} />
          ))}
          {singleRent.controlled && (
            <>
              <StyledGatesHeader>Skrytka</StyledGatesHeader>
              <StyledBoxContainer>
                <h4>{singleRent.number}</h4>
                <OpenBox id={singleRent.boxId} />
              </StyledBoxContainer>
            </>
          )}
        </Section>
      ) : null}

      {!isAuthorizedViewer ? (
        <>
          <Section>
            <RentAuthorizations rent={singleRent} />
          </Section>

          <Description description={singleRent.description} rent={singleRent} />
        </>
      ) : null}
    </>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  showUserStockMap: state.rent.showUserStockMap,
});

export default withRouter(connect(mapStateToProps)(SingleRentDetail));
