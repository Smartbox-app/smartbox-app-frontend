import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { MyRentList } from 'smartbox-types';
import { ApplicationState } from '../../../reducers';
import { __ } from '../../../helpers/i18n';

import { singleRent } from '../../../actions';
import Storage from './Storage';
import Sale from './Sale';
import OrdersHistory from './OrdersHistory';
import { NewRentButton } from './NewRentButton/NewRentButton';

import { useGetMyDetailsQuery } from 'src/queries';
import styled from 'styled-components';
import { Header } from '../../../components/ui';
import { Message } from './Message';
import { useAppForeground } from 'src/hooks/useAppForeground';

const WelcomeHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  gap: theme.spacing * 2,
  '@media(min-width: 768px)': {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

interface Props {
  rentsList: MyRentList[];
  rentsHistoryList: MyRentList[];
  loading: boolean;
  getMyRentList: () => void;
  fetchMyRentHistory: () => void;
}

const Welcome = ({
  getMyRentList,
  rentsList,
  fetchMyRentHistory,
  rentsHistoryList,
  loading,
}: Props) => {
  const { data: user } = useGetMyDetailsQuery();
  useEffect(() => {
    getMyRentList();
    fetchMyRentHistory();
  }, []);

  useAppForeground(
    () => {
      getMyRentList();
      fetchMyRentHistory();
    },
    { throttleMs: 1000 },
  );

  return (
    <>
      <WelcomeHeader>
        <Header variant="main">
          {__('application.hi')} {user!.firstName}
        </Header>
        <NewRentButton />
      </WelcomeHeader>
      <Sale />
      <Message />
      <Storage myRentList={rentsList} loading={loading} />
      <OrdersHistory rentsHistoryList={rentsHistoryList} />
    </>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  rentsList: state.rent.rentsList,
  rentsHistoryList: state.rent.rentsHistoryList,
  loading: state.rent.loading,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...singleRent,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
