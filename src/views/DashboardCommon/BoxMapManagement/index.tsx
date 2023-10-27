/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BoxListItem, RentStatus } from 'smartbox-types';
import { boxes, modal, stock } from '../../../actions';
import { Spinner } from '../../../components/Branded';
import { PageHeader } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import { isAdmin, isWorker } from '../../../utils/role-check';

import BoxDetail from './BoxDetail';

import './BoxMapManagement.scss';

import MapLegend from './MapLegend';
import SimpleStockMap from '../../../components/Common/SimpleStockMap';
import { useParams } from 'react-router';
import { findAncestor } from '../../../utils/find-ancestor';

const BoxMapManagement = () => {
    const element = useRef<HTMLDivElement | null>(null);
    const dispatch = useDispatch();
    const { stockId } = useParams<{ stockId: string }>();
    const stockList = useSelector((state: ApplicationState) => state.stock.list);
    const user = useSelector((state: ApplicationState) => state.user.details);
    const { boxesGroup } = useSelector((state: ApplicationState) => state.boxes);

    const statusColorMarker = () => {
        const catchElements = element.current?.querySelectorAll('#kontenery .storage');
        if (!catchElements) return;

        catchElements.forEach((singleElement: Element) => {
            clearBoxStatus(singleElement);
            setBoxStatus(singleElement.id, singleElement);
        });
    };

    const eventListenerAdding = () => {
        if (!user) return;
        if (isAdmin(user.role) || isWorker(user.role)) {
            const catchElements = element.current?.querySelectorAll('#kontenery .storage');

            if (!catchElements) return;

            catchElements.forEach((singleElement: Element) => {
                singleElement.addEventListener('click', handleEventModal, false);
            });
        }
    };

    useEffect(() => {
        if (!user) return;
        if (isAdmin(user.role) || isWorker(user.role)) {
            dispatch(stock.getStockList());
        }
    }, []);


    useEffect(() => {

        if (!user) return;
        if (stockId && (isAdmin(user.role) || isWorker(user.role))) {
            dispatch(boxes.fetchBoxStatuses(stockId));
        }

        return () => {
            const catchElement = element.current?.querySelectorAll('#kontenery .storage');
            catchElement?.forEach((singleElement: any) => {
                singleElement.removeEventListener('click', handleEventModal, false);
            });
        }
    }, [stockId, element, element.current])

    useEffect(() => {
        if (!user) return;
        if (stockId && (isAdmin(user.role) || isWorker(user.role))) {
            if (boxesGroup === null) {
                dispatch(boxes.fetchBoxStatuses(stockId));
            }
        }

        if (stock && (isAdmin(user.role) || isWorker(user.role))) {
            statusColorMarker();
        }

        if (!element || !element.current) return;
        eventListenerAdding();
    }, [boxesGroup])



    const clearBoxStatus = (singleElement: Element): void => {
        singleElement.firstElementChild?.classList.remove('to-check');
        singleElement.firstElementChild?.classList.remove('rented');
        singleElement.firstElementChild?.classList.remove('reserved');
        singleElement.firstElementChild?.classList.remove('to-explain');
        singleElement.lastElementChild?.classList.remove('to-explain-text');
        singleElement.firstElementChild?.classList.remove('no-paid-extension');
        singleElement.firstElementChild?.classList.remove('no-paid-extension-with-warning');
        singleElement.firstElementChild?.classList.remove('out-of-service');
        singleElement.lastElementChild?.classList.remove('out-of-service-text');
        singleElement.firstElementChild?.classList.add('free');
    };

    const setBoxStatus = (boxId: string, singleElement: Element): void => {
        boxesGroup?.forEach((singleBox: BoxListItem): void => {
            if (singleBox.number === boxId) {
                switch (singleBox.status) {
                    case RentStatus.toCheck:
                        singleElement.firstElementChild?.classList.add('to-check');
                        break;
                    case RentStatus.rented:
                        singleElement.firstElementChild?.classList.add('rented');
                        break;

                    case RentStatus.reserved:
                        singleElement.firstElementChild?.classList.add('reserved');
                        break;
                    case RentStatus.toExplain:
                        singleElement.firstElementChild?.classList.add('to-explain');
                        singleElement.lastElementChild?.classList.add('to-explain-text');
                        break;
                    case RentStatus.noPaidExtension:
                        singleElement.firstElementChild?.classList.add('no-paid-extension');
                        break;
                    case RentStatus.noPaidExtensionWithWarning:
                        singleElement.firstElementChild?.classList.add('no-paid-extension-with-warning');
                        break;
                    case RentStatus.outOfService:
                        singleElement.firstElementChild?.classList.add('out-of-service');
                        singleElement.lastElementChild?.classList.add('out-of-service-text');
                        break;
                    case RentStatus.free:
                        singleElement.firstElementChild?.classList.remove('to-check', 'rented', 'reserved', 'to-explain', 'no-paid-extension', 'no-paid-extension-with-warning', 'out-of-service');
                        singleElement.firstElementChild?.classList.remove('rented');
                        singleElement.lastElementChild?.classList.remove('to-explain-text', 'out-of-service-text');
                        singleElement.firstElementChild?.classList.add('free');
                        break;
                    default:
                        break;
                }
            } else {
                singleElement.firstElementChild?.classList.add('free');
            }
        });
    }


    const handleEventModal = (e: any): any => {

        const parent = findAncestor(e.target, '.storage');
        const selectedBoxId = parent.id;
        let selectedRentId = '';

        boxesGroup?.find((singleBox: BoxListItem): void => {
            if (singleBox.number === selectedBoxId && singleBox.status !== RentStatus.free) {
                selectedRentId = singleBox.rentId;
            }
        });

        if (selectedRentId !== '' && user && isAdmin(user.role)) {
            dispatch(boxes.fetchSingleBoxDetails(selectedRentId))
        }
        dispatch(modal.showModal(<BoxDetail selectedBoxId={selectedBoxId} rentId={selectedRentId} stockId={stockId} />));
    };

    const selectedStock = stockList.find(stock => stock.id === stockId);


    if (!user) return null;

    return (
        <div className="user-map-wrapper" ref={element}>
            <PageHeader title='application.storagesPlan' />
            {(isAdmin(user.role) || isWorker(user.role)) && <MapLegend />}
            {selectedStock?.id ? (
                <>
                    <SimpleStockMap map={selectedStock.map} />
                </>
            ) : (
                <Spinner />
            )}
        </div>
    );
}

export default BoxMapManagement
