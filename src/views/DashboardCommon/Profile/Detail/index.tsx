import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ButtonsContainer, SectionHeader } from '../../../../components/Layout';
import { Button } from '../../../../components/Common';
import { modal } from '../../../../actions';
import { ApplicationState } from '../../../../reducers';
import { UserCommonEntity } from '../../../../reducers/user-reducer';
import UserService from '../../../../services/user-service';

import UpdatePass from './UpdatePass';
import Content from './Content';
import { __ } from '../../../../helpers/i18n';

interface Props {
  user: UserCommonEntity;
  showModal: (content: React.ReactNode) => void;
}

const Detail = ({ showModal, user }: Props) => (
  <>
    <SectionHeader title={__('application.profileDetail')} />
    <ButtonsContainer>
      <Button text={__('application.edit')} primary to={`/${UserService.getSlugByRole(user.role)}/profile/update-me`} />
      <Button text={__('application.changPassword')} primary click={() => showModal(<UpdatePass />)} />
    </ButtonsContainer>
    <Content />
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
