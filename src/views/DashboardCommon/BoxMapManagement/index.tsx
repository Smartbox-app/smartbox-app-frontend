/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BoxListItem, RentStatus, StockList, UserRes } from 'smartbox-types';
import { boxes, modal, stock } from '../../../actions';
import { Spinner } from '../../../components/Common';
import { PageHeader, Section } from '../../../components/Layout';
import { __ } from '../../../helpers/i18n';
import { ApplicationState } from '../../../reducers';
import { isAdmin, isUser, isWorker } from '../../../utils/role-check';

import BoxDetail from './BoxDetail';

import './BoxMapManagement.scss';

import { ReactComponent as ReactLogo } from './map_1.2.svg';
import MapLegend from './MapLegend';
import SimpleStockMap from '../../../components/Common/SimpleStockMap';

interface Props {
  boxesGroup: BoxListItem[] | null;
  stock: StockList;
  user: UserRes;

  showModal: (content: React.ReactNode) => void;
  fetchBoxStatuses: (stockId: string) => void;
  fetchSingleBoxDetails: (rentId: string) => void;
  getStockList: () => void;

  boxNumberToMarkWay?: number;
}

class BoxMapManagement extends React.Component<Props> {
  private element: any;

  constructor(props: Props) {
    super(props);
    this.element = React.createRef();
  }

  private statusColorMarker = () => {
    const catchElement = this.element.current.querySelectorAll('#kontenery .storage');
    catchElement.forEach((singleElement: any) => {
      this.setBoxStatus(singleElement.id, singleElement);
    });
  };

  private eventListenerAdding = () => {
    const mapWrapperElement = this.element.current;

    const { user, boxNumberToMarkWay } = this.props;

    // if (isAdmin(user.role) || isWorker(user.role)) {
    //   const catchElement = this.element.current.querySelectorAll('#kontenery .storage');
    //   catchElement.forEach((singleElement: any) => {
    //     singleElement.addEventListener('click', this.handleEventModal, false);
    //   });
    // }
    //
    // if (isUser(user.role)) {
    //   const row = boxNumberToMarkWay && Math.floor(boxNumberToMarkWay / 100);
    //
    //   const catchElement = this.element.current.querySelectorAll(`.row${row}00`);
    //   catchElement.forEach((singleElement: any) => {
    //     singleElement.classList.add('rented');
    //   });
    //
    //   const myBox = this.element.current.querySelectorAll('#kontenery .storage');
    //   myBox.forEach((singleElement: any) => {
    //     if (Number(singleElement.id) === boxNumberToMarkWay) {
    //       singleElement.classList.add('myBox');
    //     }
    //   });
    // }
  };

  async componentDidMount() {
    const { fetchBoxStatuses, stock, getStockList, user } = this.props;
    if (isAdmin(user.role) || isWorker(user.role)) {
      await getStockList();
    }
    await this.eventListenerAdding();

    if (stock && (isAdmin(user.role) || isWorker(user.role))) {
      await fetchBoxStatuses(stock.id);
    }
  }

  public componentDidUpdate(prevProps: Readonly<Props>): void {
    const { fetchBoxStatuses, stock, boxesGroup, user } = this.props;
    if (stock && (isAdmin(user.role) || isWorker(user.role))) {
      boxesGroup === null && fetchBoxStatuses(stock.id);
    }

    if (stock && (isAdmin(user.role) || isWorker(user.role))) {
      // this.statusColorMarker();
    }
  }

  componentWillUnmount() {
    // const catchElement = this.element.current.querySelectorAll('#kontenery .storage');
    // catchElement.forEach((singleElement: any) => {
    //   singleElement.removeEventListener('click', this.handleEventModal, false);
    // });
  }

  private setBoxStatus = (boxId: string, singleElement: any): void => {
    const { boxesGroup } = this.props;
    boxesGroup?.forEach((singleBox: BoxListItem): void => {
      if (singleBox.number === boxId) {
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
          case RentStatus.free:
            singleElement.firstElementChild.classList.remove('to-check');
            singleElement.firstElementChild.classList.remove('rented');
            singleElement.firstElementChild.classList.remove('reserved');
            singleElement.firstElementChild.classList.remove('to-explain');
            singleElement.lastElementChild.classList.remove('to-explain-text');
            singleElement.firstElementChild.classList.remove('no-paid-extension');
            singleElement.firstElementChild.classList.remove('no-paid-extension-with-warning');
            singleElement.firstElementChild.classList.remove('out-of-service');
            singleElement.lastElementChild.classList.remove('out-of-service-text');
            singleElement.firstElementChild.classList.add('free');
            break;
          default:
            break;
        }
      } else {
        singleElement.firstElementChild.classList.add('free');
      }
    });
  };


  handleEventModal = (e: any): any => {
    const { showModal, boxesGroup, fetchSingleBoxDetails, user } = this.props;
    const selectedBoxId = e.target.parentElement.id;
    let selectedRentId = '';

    boxesGroup?.find((singleBox: BoxListItem): void => {
      if (singleBox.number === selectedBoxId && singleBox.status !== RentStatus.free) {
        selectedRentId = singleBox.rentId;
      }
    });

    if (selectedRentId !== '' && isAdmin(user.role)) {
      fetchSingleBoxDetails(selectedRentId);
    }
    showModal(<BoxDetail selectedBoxId={selectedBoxId} rentId={selectedRentId} />);
  };


  render() {
    const { stock, user, boxNumberToMarkWay } = this.props;
    return (
      <div className="user-map-wrapper">
        <PageHeader title={`${__('application.storagesPlan')}`} />
        {(isAdmin(user.role) || isWorker(user.role)) && <MapLegend />}
        {isUser(user.role) && (
          <p className="user-box">
            Twoja skrytka ma numer: <strong>{boxNumberToMarkWay}</strong>
          </p>
        )}
        {stock?.id ? (
          <>
            <SimpleStockMap />
          </>
        ) : (
          <Spinner />
        )}
      </div>
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
