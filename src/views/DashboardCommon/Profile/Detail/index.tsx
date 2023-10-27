import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserRes } from 'smartbox-types';
import { ButtonsContainer, PageHeader } from '../../../../components/Layout';
import { Button } from '../../../../components/Branded';
import { modal } from '../../../../actions';
import { ApplicationState } from '../../../../reducers';

import UpdatePass from './UpdatePass';
import UserData from '../../../../components/Common/UserData';

interface Props {
  user: UserRes | null;
  showModal: (content: React.ReactNode) => void;
}

const Detail = ({ showModal, user }: Props) => (
  <>
    <PageHeader title='application.profileDetail' />
    <ButtonsContainer>
      <Button text='application.changPassword' primary click={() => showModal(<UpdatePass />)} />
    </ButtonsContainer>
    <UserData />
  </>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
