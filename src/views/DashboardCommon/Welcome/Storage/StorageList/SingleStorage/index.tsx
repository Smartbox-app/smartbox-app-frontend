import React from 'react';
import {  MyRentList, RentStatus } from 'smartbox-types';
import { history } from '../../../../../../App';
import UserService from '../../../../../../services/user-service';
import { dateOnly } from '../../../../../../utils/format-date';
import { __ } from '../../../../../../helpers/i18n';

import './SingleStorage.scss';
import { useSelector } from 'react-redux';
import { ApplicationState } from 'src/reducers';

interface Props {
    single: MyRentList;
}

const SingleStorage = ({ single }: Props) => {
    const user = useSelector((state: ApplicationState) => state.user.details!);

    const isWarning = [RentStatus.noPaidExtension, RentStatus.noPaidExtensionWithWarning].includes(single.status);
    return (
        <div
            className="single-wrapper"
            onClick={() => history.push(`/${UserService.getSlugByRole(user.role)}/single-rent/${single.id}`)}
        >
            <div className={`storage ${isWarning ? 'warning' : ''}`}>
                {isWarning && <div className="storage-warning-overlay" />}
                <p className="sec-info">
                    {single.stockName}
                    <i className={`fa ${isWarning ? 'fa-exclamation-circle' : 'fa-info-circle'}`} aria-hidden="true" />
                </p>
                <p className="main-info">
                    <strong>
                        {__('application.miniStorage')} {__('application.shortenNumber')}: {single.number}
                    </strong>
                </p>
                <p className="details">
                    <span className="date">{dateOnly(single.finishAt)}</span>
                    <span className="size">{single.size} m</span>
                </p>
            </div>
        </div>
    );
};

export default SingleStorage;
