import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ButtonsContainer } from '../../../../components/Layout';
import { Button } from '../../../../components/Common';
import { modal } from '../../../../actions';

import Invoice from './Invoice';

interface Props {
  showModal: (content: React.ReactNode) => void;
}

const Action = ({ showModal }: Props) => (
  <ButtonsContainer max>
    <Button text="Wygeneruj fakturę" primary click={() => showModal(<Invoice orderId="asdasd" />)} />
    <Button text="Przedłuż" success click={() => showModal(<h1>Przedłuż</h1>)} />
    <Button text="Zakończ" danger click={() => showModal(<h1>Zakończ</h1>)} />
    <Button text="Wróć" primary to="/user" />
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
