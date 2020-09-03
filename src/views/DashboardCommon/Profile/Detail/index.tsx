import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ButtonsContainer, SectionHeader } from '../../../../components/Layout';
import { Button } from '../../../../components/Common';
import { modal } from '../../../../actions';

import UpdateMe from './UpdateMe';
import UpdatePass from './UpdatePass';
import Content from './Content';
import { __ } from '../../../../helpers/i18n';

interface Props {
  showModal: (content: React.ReactNode) => void;
}

const Detail = ({ showModal }: Props) => (
  <>
    <SectionHeader title={__('application.profileDetail')} />
    <ButtonsContainer>
      <Button text={__('application.edit')} primary click={() => showModal(<UpdateMe />)} />
      <Button text={__('application.changPassword')} primary click={() => showModal(<UpdatePass />)} />
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
