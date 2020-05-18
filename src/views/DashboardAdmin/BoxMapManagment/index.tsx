/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Button } from '../../../components/Common';
import { ButtonsContainer, PageHeader, Section } from '../../../components/Layout';
import { ReactComponent as ReactLogo } from './Zasob1.svg';
import { modal } from '../../../actions';

import BoxDetail from './BoxDetail';

import './BoxMapManagment.scss';

interface Props {
  showModal: (content: React.ReactNode) => void;
}

class BoxMapManagment extends React.Component<Props> {
  private element: any;

  constructor(props: any) {
    super(props);
    this.element = React.createRef();
  }

  componentDidMount() {
    const catchElement = this.element.current.querySelectorAll('.single-box');
    catchElement.forEach((singleElement: any) => {
      singleElement.addEventListener('click', this.handleEventModal, false);
      singleElement.addEventListener('mouseover', this.handleEventMouseOver, false);
      singleElement.addEventListener('mouseout', this.handleEventMouseOut, false);
    });
  }

  componentWillUnmount() {
    const catchElement = this.element.current.querySelectorAll('.single-box');
    catchElement.forEach((singleElement: any) => {
      singleElement.addEventListener('click', this.handleEventModal, false);
      singleElement.addEventListener('mouseover', this.handleEventMouseOver, false);
      singleElement.addEventListener('mouseout', this.handleEventMouseOut, false);
    });
  }

  handleEventModal = (e: any): any => {
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
        <PageHeader title="Lista pracowników" />
        <ButtonsContainer>
          <Button text="Zaproś pracowników" primary to="/admin/managment/workers/add" />
        </ButtonsContainer>
        <div className="map-wrapper" ref={this.element}>
          <ReactLogo id="svg-map" />
        </div>
      </Section>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(BoxMapManagment);
