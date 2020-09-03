/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BoxListItem, RentStatus } from 'smartbox-types';
import { ApplicationState } from '../../../reducers';

import { ReactComponent as ReactLogo } from './nowa_mapa.svg';
import { PageHeader } from '../../../components/Layout';
import { modal, boxes } from '../../../actions';
import { __ } from '../../../helpers/i18n';

import BoxDetail from './BoxDetail';
import MapLegend from './MapLegend';

import './BoxMapManagement.scss';

interface Props {
  boxesGroup: BoxListItem[];
  stockId: string;
  showModal: (content: React.ReactNode) => void;
  fetchBoxStatuses: (stockId: string) => void;
  fetchSingleBoxDetails: (rentId: string) => void;
}

class BoxMapManagement extends React.Component<Props> {
  private element: any;

  constructor(props: Props) {
    super(props);
    this.element = React.createRef();
  }

  async componentDidMount() {
    const { fetchBoxStatuses, stockId } = this.props;

    await fetchBoxStatuses(stockId);
    const catchElement = this.element.current.querySelectorAll('#kontenery .storage, #kontenery .st9');

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
            singleElement.classList.add('to-explain');
            break;
          case RentStatus.noPaidExtension:
            singleElement.classList.add('no-paid-extension');
            break;
          case RentStatus.noPaidExtensionWithWarning:
            singleElement.classList.add('no-paid-extension-with-warning');
            break;
          default:
            break;
        }
      }
    });
  };

  handleEventModal = (e: any): any => {
    const { showModal, boxesGroup, fetchSingleBoxDetails } = this.props;
    let selectedBoxId = e.target.parentElement.parentElement.id.slice(1);
    let selectedRentId = '';
    if (e.target.parentElement.attributes.class && e.target.parentElement.attributes.class.value === 'storage') {
      selectedBoxId = e.target.parentElement.id.slice(1);
    }

    if (e.target.attributes.class.value === 'st9 st10') {
      selectedBoxId = e.target.parentElement.id.slice(1);
    }

    boxesGroup.find((singleBox: BoxListItem): void => {
      if (singleBox.number === selectedBoxId && singleBox.status !== RentStatus.free) {
        selectedRentId = singleBox.rentId;
      }
    });

    if (selectedRentId !== '') {
      fetchSingleBoxDetails(selectedRentId);
    }
    showModal(<BoxDetail selectedBoxId={selectedBoxId} rentId={selectedRentId} />);
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
        <PageHeader title={`${__('application.storagesPlan')}`} />
        <MapLegend />
        <div className="map-wrapper" ref={this.element}>
          <ReactLogo id="svg-map" />
        </div>
      </>
    );
  }
}
const mapStateToProps = (state: ApplicationState) => ({
  boxesGroup: state.boxes.boxesGroup,
  user: state.user.details,
  stockId: state.rent.stockId,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
      ...boxes,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(BoxMapManagement);
