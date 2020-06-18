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
    <Button text="Przedłuż" success />
    <Button text="Zakończ" danger />
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
