import React from 'react';
import { connect } from 'react-redux';
import { RentStatus, UserRes } from 'smartbox-types';
import { ApplicationState } from '../../../../../reducers';
import { isAdmin, isAdminOrTenant, isWorker } from '../../../../../utils/role-check';

import Position from './Position';
import Status from './Status';
import WorkerEdit from './WorkerEdit';

import './Edit.scss';
import { Alert } from '../../../../../components/Common';

interface Props {
    selectedBoxId: string;
    user: UserRes | null;
    rentId: string;
    singleBoxDetailStatus: RentStatus;
    display: boolean;
    stockId: string;
    callback?: () => void;
}

const Edit = ({ selectedBoxId, user, rentId, singleBoxDetailStatus, display, stockId, callback }: Props) => {
    if (!user) return null;
    return <div className={`edit-wrapper ${display && 'show-me'}`}>
        <Alert text='application.changesIrreversible' type="primary" />
        {isAdminOrTenant(user.role) && <Status callback={callback} selectedBoxId={selectedBoxId} stockId={stockId} rentId={rentId} />}
        {isAdminOrTenant(user.role) && rentId !== '' && singleBoxDetailStatus === RentStatus.rented && <Position callback={callback} rentId={rentId} stockId={stockId} />}
        {isWorker(user.role) && <WorkerEdit callback={callback} rentId={rentId} selectedBoxId={selectedBoxId} />}
    </div>
}

const mapStateToProps = (state: ApplicationState) => ({
    user: state.user.details,
});

export default connect(mapStateToProps)(Edit);
