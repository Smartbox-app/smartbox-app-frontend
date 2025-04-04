import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ButtonsContainer, PageHeader } from '../../../../components/Layout';
import { Button } from '../../../../components/Branded';
import { modal } from '../../../../actions';

import UpdatePass from './UpdatePass';
import UserData from '../../../../components/Common/UserData';

interface Props {
  showModal: (content: React.ReactNode) => void;
}

const Detail = ({ showModal }: Props) => {
  return (
    <>
      <PageHeader title="application.profileDetail" />
      <ButtonsContainer>
        <Button
          text="application.changPassword"
          primary
          click={() => showModal(<UpdatePass />)}
        />
      </ButtonsContainer>
      <UserData />
    </>
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(Detail);
