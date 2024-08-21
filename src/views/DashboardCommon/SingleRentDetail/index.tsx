import React, { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentDetails, MyRentList } from 'smartbox-types';
import { Spinner } from '../../../components/Branded';
import { UserStockMap } from '../../../components/Common/UserStockMap';
import { Section, SectionHeader } from '../../../components/Layout';

import { singleRent } from '../../../actions';
import { ApplicationState } from '../../../reducers';

import Action from './Action';
import Details from './Details';
import Gate from './Gate';
import MissingPaymentAlert from './MissingPaymentAlert';
import ApiService from '../../../services/api-service';
import { OpenBox } from './OpenBox';
import styled from 'styled-components';
import { Description } from './RentDescription';

interface RouteProps {
  orderId: string;
}
interface Props extends RouteComponentProps<RouteProps> {
  showUserStockMap: boolean;
}

const StyledGatesHeader = styled.div`
font-weight: 700;
margin: 20px 0 10px 0;`

const SingleRentDetail = ({ showUserStockMap, match }: Props) => {
  const [singleRent, setSingleRent] = useState<MyRentDetails>();
  const [loading, setLoading] = useState(false);

  const getSingleRent = async () => {
    setLoading(true);
    await ApiService.callFetch('GET', `rent/my-details/${match.params.orderId}`, (data: MyRentDetails) => {
      setSingleRent(data);
    });
    setLoading(false);
  }

  useEffect(() => {
    getSingleRent();
  }, []);

  if (loading) return <Spinner />;
  if (!singleRent) return null;

  return (
    <Section full>
      <SectionHeader title="application.rentDetail" />
      <MissingPaymentAlert />
      <Action rent={singleRent} isMapActive={singleRent.isMap} />
      {!showUserStockMap ? (
        <>
          <Details singleRent={singleRent} />
          <Description description={singleRent.description} />

          <Section highlight>

            <SectionHeader title='application.access' />
            {singleRent.gates && singleRent.gates.length > 0 && <StyledGatesHeader>Bramy</StyledGatesHeader>}
            {singleRent.gates.map(gate => <Gate key={gate.id} gate={gate} />)}
            {singleRent.controlled && <OpenBox id={singleRent.boxId} />}
          </Section>
        </>
      ) : (
        <UserStockMap boxId={singleRent.boxId} boxNumber={singleRent.boxNumber} boxAdditionalInfo={singleRent.boxAdditionalInfo} stockId={singleRent.stockId} />
      )}
    </Section>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  singleRent: state.rent.singleRent,
  loading: state.spinner.loading,
  showUserStockMap: state.rent.showUserStockMap,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...singleRent,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleRentDetail));
