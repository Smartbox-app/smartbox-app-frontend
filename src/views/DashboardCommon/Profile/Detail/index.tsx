import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ButtonsContainer, SectionHeader } from '../../../../components/Layout';
import { Button } from '../../../../components/Common';
import { modal } from '../../../../actions';
import { ApplicationState } from '../../../../reducers';
import { UserCommonEntity } from '../../../../reducers/user-reducer';

import UpdatePass from './UpdatePass';
import { __ } from '../../../../helpers/i18n';
import UserData from '../../../../components/Common/UserData';

interface Props {
  user: UserCommonEntity;
  showModal: (content: React.ReactNode) => void;
}

const Detail = ({ showModal, user }: Props) => (
  <>
    <SectionHeader title={__('application.profileDetail')} />
    <ButtonsContainer>
      <Button text={__('application.changPassword')} primary click={() => showModal(<UpdatePass />)} />
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
