import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserRes } from 'smartbox-types';
import { modal } from '../../../../actions';
import { history } from '../../../../App';
import { ApplicationState } from '../../../../reducers';
import UserService from '../../../../services/user-service';
import UpdateMe from '../../../../views/DashboardCommon/Profile/Detail/UpdateMe';
import { ButtonsContainer, SectionHeader } from '../../../Layout';
import Alert from '../../Alert';
import Button from '../../Button';

interface Props {
  user: UserRes;
  hideModal: () => void;
}

const NoPhoneModal = ({ hideModal, user }: Props) => {
  return (
    <div>
      <SectionHeader title="application.phoneNumberIsRequired" />
      <Alert type="primary" text="application.fillPhoneNumber" />
      <UpdateMe />
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...modal }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NoPhoneModal);
