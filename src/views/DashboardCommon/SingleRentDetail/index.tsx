import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentList } from 'smartbox-types';
import { Spinner } from '../../../components/Branded';
import UserStockMap from '../../../components/Common/UserStockMap';
import { Section, SectionHeader } from '../../../components/Layout';

import { singleRent } from '../../../actions';
import { ApplicationState } from '../../../reducers';

import Action from './Action';
import Details from './Details';
import Gate from './Gate';
import MissingPaymentAlert from './MissingPaymentAlert';

interface RouteProps {
  orderId: string;
}
interface Props extends RouteComponentProps<RouteProps> {
  loading: boolean;
  showUserStockMap: boolean;
  singleRent: MyRentList;
  getSingleRent: (rentId: string) => void;
  getMyRentList: () => void;
}

const SingleRentDetail = ({ loading, showUserStockMap, match, getSingleRent, singleRent, getMyRentList }: Props) => {
  useEffect(() => {
    (async () => {
      await getMyRentList();
      await getSingleRent(match.params.orderId);
    })();
  }, []);

  if (loading) return <Spinner />;

  return (
    <Section full>
      <SectionHeader title="application.rentDetail" />
      <MissingPaymentAlert />
      <Action rentId={singleRent.id} />
      {!showUserStockMap ? (
        <>
          <Details singleRent={singleRent} />
          <Gate stockId={singleRent.stockId} />
        </>
      ) : (
        <UserStockMap boxNumberToMarkWay={Number(singleRent.number)} stockId={singleRent.stockId} />
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
