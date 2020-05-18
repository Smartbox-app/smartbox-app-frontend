/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { BoxListItem } from 'smartbox-types';
import { ReactComponent as ReactLogo } from './nowa_mapa.svg';
import { Button } from '../../../components/Common';
import { ButtonsContainer, PageHeader, Section } from '../../../components/Layout';
import { modal, boxes } from '../../../actions';

import BoxDetail from './BoxDetail';

import './BoxMapManagment.scss';

interface Props {
  boxesGroup: BoxListItem[];
  showModal: (content: React.ReactNode) => void;
  fetchBoxStatuses: () => void;
}

class BoxMapManagment extends React.Component<Props> {
  private element: any;

  constructor(props: any) {
    super(props);
    this.element = React.createRef();
  }

  componentDidMount() {
    // fetch boxes statuses
    this.props.fetchBoxStatuses();

    const catchElement = this.element.current.querySelectorAll('.storage');
    catchElement.forEach((singleElement: any) => {
      console.log('singleElement', singleElement);
      singleElement.addEventListener('click', this.handleEventModal, false);
      singleElement.addEventListener('mouseover', this.handleEventMouseOver, false);
      singleElement.addEventListener('mouseout', this.handleEventMouseOut, false);
    });
  }

  componentWillUnmount() {
    const catchElement = this.element.current.querySelectorAll('.storage');
    catchElement.forEach((singleElement: any) => {
      singleElement.addEventListener('click', this.handleEventModal, false);
      singleElement.addEventListener('mouseover', this.handleEventMouseOver, false);
      singleElement.addEventListener('mouseout', this.handleEventMouseOut, false);
    });
  }

  handleEventModal = (e: any): any => {
    console.log('e', e);
    let selectedBoxId = 1;
    if (e.target.attributes.class.value === 'cls-2') {
      console.log('e', e.target.parentElement.parentElement.dataset.name);
      selectedBoxId = e.target.parentElement.parentElement.dataset.name;
    }

    if (e.target.attributes.class.value === 'cls-3') {
      console.log('e', e.target.parentElement.dataset.name);
      selectedBoxId = e.target.parentElement.dataset.name;
    }

    this.props.showModal(<BoxDetail selectedBoxId={selectedBoxId} />);
  };

  handleEventMouseOver = (e: any): any => {
    if (e.target.attributes.class.value === 'cls-2') {
      console.log('handleEventMouseOver', e.target.parentElement.parentElement.dataset.name);
    }
  };

  handleEventMouseOut = (e: any): any => {
    if (e.target.attributes.class.value === 'cls-2') {
      console.log('handleEventMouseOut', e.target.parentElement.parentElement.dataset.name);
    }
  };

  render() {
    return (
      <Section full>
        <PageHeader title="Plan placu" />
        <div className="map-wrapper" ref={this.element}>
          <ReactLogo id="svg-map" />
        </div>
      </Section>
    );
  }
}
const mapStateToProps = (state: any) => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(BoxMapManagment);
