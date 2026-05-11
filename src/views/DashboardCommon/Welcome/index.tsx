import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { __ } from '../../../helpers/i18n';
import Storage from './Storage';
import Sale from './Sale';
import OrdersHistory from './OrdersHistory';
import { NewRentButton } from './NewRentButton/NewRentButton';
import {
  useGetMyDetailsQuery,

} from 'src/queries';
import styled from 'styled-components';
import { Header } from '../../../components/ui';
import { Message } from './Message';
import { useAppForeground } from 'src/hooks/useAppForeground';
import { useGetMyAuthorizedRentsQuery } from 'src/queries/useGetMyAuthorizedRents/useGetMyAuthorizedRents';
import { useGetMyRentsQuery } from 'src/queries/useGetMyRentsQuery/useGetMyRentsQuery';

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

const Welcome = () => {
  const queryClient = useQueryClient();
  const { data: user } = useGetMyDetailsQuery();

  const { data: rentsList = [], isPending: loadingRents } =
    useGetMyRentsQuery();
  const { data: authorizedRentsList = [] } = useGetMyAuthorizedRentsQuery();
  const { data: rentsHistoryList = [] } = useGetMyRentsQuery();

  useAppForeground(
    () => {
      queryClient.invalidateQueries({ queryKey: ['my-rents'] });
      queryClient.invalidateQueries({
        queryKey: ['my-authorized-rents'],
      });
      queryClient.invalidateQueries({ queryKey: ['my-rent-story'] });
    },
    { throttleMs: 1000 },
  );

  if (!user) return null;

  return (
    <>
      <WelcomeHeader>
        <Header variant="main">
          {__('application.hi')} {user.firstName}
        </Header>
        <NewRentButton />
      </WelcomeHeader>
      <Sale />
      <Message />
      <Storage
        myRentList={rentsList}
        loading={loadingRents}
        title="manage_boxes"
      />
      {authorizedRentsList.length > 0 ? (
        <Storage
          myRentList={authorizedRentsList}
          loading={false}
          title="manage_authorized_boxes"
        />
      ) : null}
      <OrdersHistory rentsHistoryList={rentsHistoryList} />
    </>
  );
};

export default Welcome;
