import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ButtonsContainer } from '../../../../components/Layout';
import { Button } from '../../../../components/Common';
import { modal } from '../../../../actions';
import { __ } from '../../../../helpers/i18n';

import Invoice from './Invoice';

interface Props {
  showModal: (content: React.ReactNode) => void;
}

const Action = ({ showModal }: Props) => (
  <ButtonsContainer max>
    <Button text={__('application.generateInvoice')} primary click={() => showModal(<Invoice orderId="asdasd" />)} />
    <Button text={__('application.goToAgreement')} success click={() => showModal(<h1>Przedłuż</h1>)} />
    <Button text={__('application.end')} danger click={() => showModal(<h1>Zakończ</h1>)} />
    <Button text={__('application.back')} primary to="/user" />
  </ButtonsContainer>
);

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(Action);
