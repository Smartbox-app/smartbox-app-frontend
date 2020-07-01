import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BoxListItem } from 'smartbox-types';
import { ApplicationState } from '../../../reducers';

import { PageHeader } from '../../../components/Layout';
import { modal, boxes } from '../../../actions';
import Form from './Form';

// import './BoxMapManagement.scss';

interface Props {
  boxesGroup: BoxListItem[];
  showModal: (content: React.ReactNode) => void;
  fetchBoxStatuses: (stockId: string) => void;
  fetchSingleBoxDetails: (rentId: string) => void;
}

class DiscountCodes extends React.Component<Props> {
  render() {
    return (
      <>
        <PageHeader title="Generowanie kodów zniżkowych" />
        <Form />
      </>
    );
  }
}
const mapStateToProps = (state: ApplicationState) => ({
  boxesGroup: state.boxes.boxesGroup,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
      ...boxes,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(DiscountCodes);
