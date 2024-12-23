import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { BoxListRes, BoxMapRes, RentDetailsRes, RentStatus, UserRes } from 'smartbox-types';
import { connect, useDispatch } from 'react-redux';
import { boxes } from '../../../actions';
import { PageHeader } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import { dateOnly } from '../../../utils/format-date';
import { __ } from '../../../helpers/i18n';
import { isAdminOrTenant } from '../../../utils/role-check';

import DescriptionRow from './DescriptionRow';
import Edit from './Edit';

import './BoxDetail.scss';

interface Props {
    singleBoxDetail: RentDetailsRes;
    box: BoxListRes | BoxMapRes;
    user: UserRes | null;
    stockId: string;
    boxDataCleanUp: () => void;
    callback?: () => void;
}

const BoxDetail = ({ boxDataCleanUp, box: { rentId, id, identifier, status }, singleBoxDetail, user, stockId, callback }: Props) => {
    const [optionDisplayState, optionDisplayToggle] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (rentId) dispatch(boxes.fetchSingleBoxDetails(rentId));

        return () => {
            boxDataCleanUp();
        };
    }, []);

    if (!user) return null;

    const isThisBoxFree = (data: string): boolean => data === '';

    return (
        <div className="detail-wrapper">
            <PageHeader title='application.singleStoreDetail' />

            <DescriptionRow icon="fa-lock" text='application.storeNumber'>
                {identifier}
            </DescriptionRow>

            {isAdminOrTenant(user.role) && (
                <>
                    {rentId && status !== RentStatus.free && <>
                        <DescriptionRow icon="fa-user" text='application.rentedBy'>
                            {singleBoxDetail.owner ? `${singleBoxDetail.owner.firstName} ${singleBoxDetail.owner.lastName}` : '---'}
                        </DescriptionRow>

                        <DescriptionRow icon="fa-calendar" text='application.startDate'>
                            {dateOnly(singleBoxDetail.startAt)}
                        </DescriptionRow>

                        <DescriptionRow icon="fa-calendar" text='application.endDate'>
                            {dateOnly(singleBoxDetail.finishAt)}
                        </DescriptionRow>


                        <DescriptionRow icon="fa-mobile" text='application.phone'>
                            {singleBoxDetail?.owner?.phone ? (
                                <a href={`tel:${singleBoxDetail.owner.phone}`}>{singleBoxDetail.owner.phone}</a>
                            ) : (
                                '---'
                            )}
                        </DescriptionRow>

                        <DescriptionRow icon="fa-envelope" text='application.mail'>
                            {isThisBoxFree(rentId) ? (
                                '---'
                            ) : (
                                <a
                                    href={`mailto:${singleBoxDetail.owner?.email ? singleBoxDetail.owner?.email : 'error'}`}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    {singleBoxDetail.owner ? singleBoxDetail.owner.email : __('application.lack')}
                                </a>
                            )}
                        </DescriptionRow>
                    </>}

                    <DescriptionRow icon="fa-arrow-right" text='application.storeState'>
                        {`${singleBoxDetail.status}`}
                    </DescriptionRow>



                </>
            )}
            <Edit display callback={callback} selectedBoxId={id} rentId={rentId} singleBoxDetailStatus={singleBoxDetail.status} stockId={stockId} />
        </div>
    );
};

const mapStateToProps = (state: ApplicationState) => ({
    singleBoxDetail: state.boxes.singleBoxDetail,
    user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...boxes }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BoxDetail);
