/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BoxListItem, RentStatus, StockList } from 'smartbox-types';
import { Button, Spinner } from '../../../components/Common';
import { ApplicationState } from '../../../reducers';

import { ReactComponent as ReactLogo } from './map_1.2.svg';
import { PageHeader } from '../../../components/Layout';
import { modal, boxes, stock } from '../../../actions';
import { __ } from '../../../helpers/i18n';

import BoxDetail from './BoxDetail';
import MapLegend from './MapLegend';

import './BoxMapManagement.scss';

interface Props {
  boxesGroup: BoxListItem[] | null;
  stock: StockList;
  showModal: (content: React.ReactNode) => void;
  fetchBoxStatuses: (stockId: string) => void;
  fetchSingleBoxDetails: (rentId: string) => void;
  getStockList: () => void;
}
interface State {
  isMouseDown: boolean;
  grabStartX: number;
  scrollLeft: number;
}

class BoxMapManagement extends React.Component<Props, State> {
  private element: any;

  constructor(props: Props) {
    super(props);
    this.element = React.createRef();
    this.state = {
      isMouseDown: false,
      grabStartX: 0,
      scrollLeft: 0,
    };
  }

  private statusColorMarker = () => {
    const catchElement = this.element.current.querySelectorAll('#kontenery .storage');
    catchElement.forEach((singleElement: any) => {
      this.setBoxStatus(singleElement.id, singleElement);
    });
  };

  private eventListenerAdding = () => {
    const mapWrapperElement = this.element.current;
    mapWrapperElement.addEventListener(
      'mousedown',
      (e: MouseEvent) => this.handleMouseDown(e, this.element.current),
      false,
    );
    mapWrapperElement.addEventListener(
      'mouseup',
      (e: MouseEvent) => this.handleMouseUp(e, this.element.current),
      false,
    );
    mapWrapperElement.addEventListener(
      'mouseleave',
      (e: MouseEvent) => this.handleMouseLeave(e, this.element.current),
      false,
    );
    mapWrapperElement.addEventListener(
      'mousemove',
      (e: MouseEvent) => this.handleMouseMove(e, this.element.current),
      false,
    );

    const catchElement = this.element.current.querySelectorAll('#kontenery .storage');
    catchElement.forEach((singleElement: any) => {
      singleElement.addEventListener('click', this.handleEventModal, false);
      singleElement.addEventListener('mouseover', this.handleEventMouseOver, false);
      singleElement.addEventListener('mouseout', this.handleEventMouseOut, false);
    });
  };

  async componentDidMount() {
    const { fetchBoxStatuses, stock, getStockList } = this.props;
    await getStockList();
    await this.eventListenerAdding();

    if (stock) {
      await fetchBoxStatuses(stock.id);
    }
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
    const { fetchBoxStatuses, stock, boxesGroup } = this.props;
    console.log('boxesGroup', boxesGroup);
    boxesGroup === null && fetchBoxStatuses(stock.id);

    if (stock) {
      this.statusColorMarker();
    }
  }

  componentWillUnmount() {
    const catchElement = this.element.current.querySelectorAll('#kontenery .storage');
    catchElement.forEach((singleElement: any) => {
      singleElement.removeEventListener('click', this.handleEventModal, false);
      singleElement.removeEventListener('mouseover', this.handleEventMouseOver, false);
      singleElement.removeEventListener('mouseout', this.handleEventMouseOut, false);
    });
  }

  private setBoxStatus = (boxId: string, singleElement: any): void => {
    const { boxesGroup } = this.props;

    boxesGroup?.forEach((singleBox: BoxListItem): void => {
      if (singleBox.number === boxId && singleBox.status !== RentStatus.free) {
        switch (singleBox.status) {
          case RentStatus.toCheck:
            singleElement.firstElementChild.classList.add('to-check');
            break;
          case RentStatus.rented:
            singleElement.firstElementChild.classList.add('rented');
            break;
          case RentStatus.reserved:
            singleElement.firstElementChild.classList.add('reserved');
            break;
          case RentStatus.toExplain:
            singleElement.firstElementChild.classList.add('to-explain');
            singleElement.lastElementChild.classList.add('to-explain-text');
            break;
          case RentStatus.noPaidExtension:
            singleElement.firstElementChild.classList.add('no-paid-extension');
            break;
          case RentStatus.noPaidExtensionWithWarning:
            singleElement.firstElementChild.classList.add('no-paid-extension-with-warning');
            break;
          case RentStatus.outOfService:
            singleElement.firstElementChild.classList.add('out-of-service');
            singleElement.lastElementChild.classList.add('out-of-service-text');
            break;
          default:
            break;
        }
      } else {
        singleElement.firstElementChild.classList.add('free');
      }
    });
  };

  private handleMouseDown = (e: MouseEvent, el: HTMLElement): any => {
    this.setState({
      isMouseDown: true,
      grabStartX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
    });
    el.classList.add('grab');
  };

  private handleMouseUp = (e: MouseEvent, el: HTMLElement): any => {
    this.setState({
      isMouseDown: false,
    });
    el.classList.remove('grab');
  };

  private handleMouseLeave = (e: MouseEvent, el: HTMLElement): any => {
    this.setState({
      isMouseDown: false,
    });
    el.classList.remove('grab');
  };

  private handleMouseMove = (e: MouseEvent, el: HTMLElement): any => {
    const { isMouseDown, grabStartX, scrollLeft } = this.state;
    if (!isMouseDown) return;
    e.preventDefault();
    const mousePositionX = e.pageX - el.offsetLeft;
    const mapMoveDistance = mousePositionX - grabStartX;

    el.scrollLeft = scrollLeft - mapMoveDistance;
  };

  handleEventModal = (e: any): any => {
    const { showModal, boxesGroup, fetchSingleBoxDetails } = this.props;
    const selectedBoxId = e.target.parentElement.id;
    let selectedRentId = '';

    boxesGroup?.find((singleBox: BoxListItem): void => {
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
    const { stock } = this.props;
    return (
      <>
        <PageHeader title={`${__('application.storagesPlan')}`} />
        <MapLegend />
        {stock?.id ? (
          <div className="map-wrapper" ref={this.element}>
            <div className="map-scale">
              <span className="fa fa-plus-circle" />
              <span className="fa fa-minus-circle" />
            </div>
            <ReactLogo id="svg-map" />
          </div>
        ) : (
          <Spinner />
        )}
      </>
    );
  }
}
const mapStateToProps = (state: ApplicationState) => ({
  boxesGroup: state.boxes.boxesGroup,
  user: state.user.details,
  stock: state.stock.list[0],
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
      ...boxes,
      ...stock,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(BoxMapManagement);
