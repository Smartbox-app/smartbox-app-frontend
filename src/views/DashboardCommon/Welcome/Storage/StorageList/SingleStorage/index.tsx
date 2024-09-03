import React from 'react';
import { MyRentList, RentStatus } from 'smartbox-types';
import styled from 'styled-components';
import { lighten } from 'polished';
import { history } from '../../../../../../App';
import UserService from '../../../../../../services/user-service';
import { dateOnly } from '../../../../../../utils/format-date';
import { __ } from '../../../../../../helpers/i18n';

import './SingleStorage.scss';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';
import { getColorForBackground } from '../../../../../../utils/color';


interface Props {
    single: MyRentList;
}

const StyledStorage = styled.div`
background-color: ${({ theme }) => theme.colors.primary};
border: 2px solid${({ theme }) => lighten(0.1, theme.colors.primary)};
color: ${({ theme }) => getColorForBackground(theme.colors.primary)};
&:hover {
    box-shadow: 0 0 2px 1px ${({ theme }) => lighten(0.1, theme.colors.primary)
    };
}`

const SingleStorage = ({ single }: Props) => {
    const user = useSelector((state: ApplicationState) => state.user.details!);

    const isWarning = [RentStatus.noPaidExtension, RentStatus.noPaidExtensionWithWarning].includes(single.status);
    return (
        <div
            className="single-wrapper"
            onClick={() => history.push(`/${UserService.getSlugByRole(user.role)}/single-rent/${single.id}`)}
        >
            <StyledStorage className={`storage ${isWarning ? 'warning' : ''}`}>
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
            </StyledStorage>
        </div>
    );
};

export default SingleStorage;
