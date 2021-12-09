import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserRes } from 'smartbox-types';
import { modal } from '../../../../actions';
import { history } from '../../../../App';
import { ApplicationState } from '../../../../reducers';
import UserService from '../../../../services/user-service';
import { ButtonsContainer, SectionHeader } from '../../../Layout';
import Alert from '../../Alert';
import Button from '../../Button';
import {__} from "../../../../helpers/i18n";

interface Props {
  user: UserRes;
  hideModal: () => void;
}

const NoPhoneModal = ({ hideModal, user }: Props) => {
  return (
    <div>
      <SectionHeader title='application.phoneNumberIsRequired' />
      <Alert type="primary" text='application.fillPhoneNumber'/>
      <ButtonsContainer>
        <Button text={__('application.cancel')} click={() => hideModal()} danger />
        <Button
          text={__('application.goToProfile')}
          success
          click={() => {
            hideModal();
            history.push(`/${UserService.getSlugByRole(user.role)}/profile`);
          }}
        />
      </ButtonsContainer>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...modal }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NoPhoneModal);
