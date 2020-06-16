import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ButtonsContainer, SectionHeader } from '../../../../components/Layout';
import { Button } from '../../../../components/Common';
import { modal } from '../../../../actions';

import Form from './Form';
import Content from './Content';

interface Props {
  showModal: (content: React.ReactNode) => void;
}

const Detail = ({ showModal }: Props) => (
  <>
    <SectionHeader title="Szczegóły Profilu" />
    <ButtonsContainer>
      <Button text="Edytuj" primary click={() => showModal(<Form />)} />
      <Button text="Zmień hasło" primary click={() => showModal(<Form />)} />
    </ButtonsContainer>
    <Content />
  </>
);

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(Detail);
