/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { BoxListItem, RentStatus } from 'smartbox-types';
import { ReactComponent as ReactLogo } from './nowa_mapa.svg';
import { Button } from '../../../components/Common';
import { ButtonsContainer, PageHeader, Section } from '../../../components/Layout';
import { modal, boxes } from '../../../actions';

import BoxDetail from './BoxDetail';
import MapLegend from './MapLegend';

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

  async componentDidMount() {
    const { fetchBoxStatuses, boxesGroup } = this.props;
    // fetch boxes statuses
    await fetchBoxStatuses();
    const catchElement = this.element.current.querySelectorAll('#kontenery .storage, #kontenery .st9');
    // const catchElement = this.element.current.querySelectorAll('.st9');
    console.log('catchElement', catchElement);
    await catchElement.forEach((singleElement: any) => {
      this.setBoxStatus(singleElement.parentElement.parentElement.id.slice(1), singleElement);
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

  private setBoxStatus = (boxId: string, singleElement: any): void => {
    const { boxesGroup } = this.props;
    boxesGroup.find((singleBox: BoxListItem): void => {
      if (singleBox.number === boxId && singleBox.status !== RentStatus.free) {
        switch (singleBox.status) {
          case RentStatus.toCheck:
            singleElement.classList.add('toCheck');
            break;
          case RentStatus.rented:
            singleElement.classList.add('rented');
            break;
          case RentStatus.reserved:
            singleElement.classList.add('reserved');
            break;
          case RentStatus.toExplain:
            singleElement.classList.add('toExplain');
            break;
          case RentStatus.noPaidExtension:
            singleElement.classList.add('noPaidExtension');
            break;
          case RentStatus.noPaidExtensionWithWarning:
            singleElement.classList.add('noPaidExtensionWithWarning');
            break;
          default:
            break;
        }
      }
    });
  };

  handleEventModal = (e: any): any => {
    const { showModal } = this.props;
    let selectedBoxId = e.target.parentElement.parentElement.id.slice(1);
    if (e.target.parentElement.attributes.class && e.target.parentElement.attributes.class.value === 'storage') {
      selectedBoxId = e.target.parentElement.id.slice(1);
    }

    if (e.target.attributes.class.value === 'st9 st10') {
      console.log('handleEventModal', e.target.parentElement.id.slice(1));
      selectedBoxId = e.target.parentElement.id.slice(1);
    }

    showModal(<BoxDetail selectedBoxId={selectedBoxId} />);
  };

  handleEventMouseOver = (e: any): any => {
    if (e?.target?.attributes?.class?.value === 'cls-2') {
      console.log('handleEventMouseOver', e.target.parentElement.parentElement.dataset.name);
    }
  };

  handleEventMouseOut = (e: any): any => {
    if (e?.target?.attributes?.class?.value === 'cls-2') {
      console.log('handleEventMouseOut', e.target.parentElement.parentElement.dataset.name);
    }
  };

  render() {
    return (
      <>
        <PageHeader title="Plan placu" />
        <MapLegend />
        <div className="map-wrapper" ref={this.element}>
          <ReactLogo id="svg-map" />
        </div>
      </>
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
