/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BoxListItem, RentStatus, StockList } from 'smartbox-types';
import { Spinner } from '../../../components/Common';
import { ApplicationState } from '../../../reducers';

import { ReactComponent as ReactLogo } from './nowa_mapa.svg';
import { PageHeader } from '../../../components/Layout';
import { modal, boxes, stock } from '../../../actions';
import { __ } from '../../../helpers/i18n';

import BoxDetail from './BoxDetail';
import MapLegend from './MapLegend';

import './BoxMapManagement.scss';

interface Props {
  boxesGroup: BoxListItem[];
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

  private eventListenerAdding = () => {
    const mapWrapperElement = this.element.current;

    console.log('this.element.current', this.element.current);

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

    const catchElement = this.element.current.querySelectorAll('#kontenery .storage, #kontenery .st9');

    catchElement.forEach((singleElement: any) => {
      this.setBoxStatus(singleElement.parentElement.parentElement.id.slice(1), singleElement);
      singleElement.addEventListener('click', this.handleEventModal, false);
      singleElement.addEventListener('mouseover', this.handleEventMouseOver, false);
      singleElement.addEventListener('mouseout', this.handleEventMouseOut, false);
    });
  };

  async componentDidMount() {
    const { fetchBoxStatuses, stock, getStockList } = this.props;
    await getStockList();
    if (stock) {
      await fetchBoxStatuses(stock.id);
      await this.eventListenerAdding();
    }
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
    const { fetchBoxStatuses, stock, boxesGroup } = this.props;
    boxesGroup.length === 0 && fetchBoxStatuses(stock.id);

    if (stock) {
      this.eventListenerAdding();
    }
  }

  componentWillUnmount() {
    const catchElement = this.element.current.querySelectorAll('#kontenery .storage, #kontenery .st9');
    catchElement.forEach((singleElement: any) => {
      singleElement.removeEventListener('click', this.handleEventModal, false);
      singleElement.removeEventListener('mouseover', this.handleEventMouseOver, false);
      singleElement.removeEventListener('mouseout', this.handleEventMouseOut, false);
    });
  }

  private setBoxStatus = (boxId: string, singleElement: any): void => {
    const { boxesGroup } = this.props;
    boxesGroup.find((singleBox: BoxListItem): void => {
      if (singleBox.number === boxId && singleBox.status !== RentStatus.free) {
        switch (singleBox.status) {
          case RentStatus.toCheck:
            singleElement.classList.add('to-check');
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
          case RentStatus.outOfService:
            singleElement.classList.add('out-of-service');
            break;
          default:
            break;
        }
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
    console.log('handleEventModal', e.target.parentElement);
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
    const { stock } = this.props;
    return (
      <>
        <PageHeader title={`${__('application.storagesPlan')}`} />
        <MapLegend />
        {console.log('stock?.id ', stock?.id)}
        {stock?.id ? (
          <div className="map-wrapper" ref={this.element}>
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
