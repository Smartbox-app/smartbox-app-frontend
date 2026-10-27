import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import styled from 'styled-components';

import { Header } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useAppForeground } from 'src/hooks/useAppForeground';
import {
  useGetMyDetailsQuery,

} from 'src/queries';
import { useGetMyAuthorizedRentsQuery } from 'src/queries/useGetMyAuthorizedRents/useGetMyAuthorizedRents';
import { useGetMyRentsQuery } from 'src/queries/useGetMyRentsQuery/useGetMyRentsQuery';
import { Message } from './Message';
import { NewRentButton } from './NewRentButton/NewRentButton';
import OrdersHistory from './OrdersHistory';
import Sale from './Sale';
import Storage from './Storage';

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
      <OrdersHistory />
    </>
  );
};

export default Welcome;
