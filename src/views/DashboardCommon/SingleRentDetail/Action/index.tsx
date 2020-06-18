import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ButtonsContainer } from '../../../../components/Layout';
import { Button } from '../../../../components/Common';
import { modal } from '../../../../actions';

interface Props {
  showModal: (content: React.ReactNode) => void;
}

const Action = ({ showModal }: Props) => (
  <ButtonsContainer>
    <Button text="Wygeneruj fakturę" primary />
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
