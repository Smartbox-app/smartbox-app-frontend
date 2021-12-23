import React from 'react';
import { connect } from 'react-redux';
import { RentStatus, UserRes } from 'smartbox-types';
import { ApplicationState } from '../../../../../reducers';
import { isAdmin, isWorker } from '../../../../../utils/role-check';

import Position from './Position';
import Status from './Status';
import WorkerEdit from './WorkerEdit';

import './Edit.scss';
import { Alert } from '../../../../../components/Common';

interface Props {
  selectedBoxId: string;
  user: UserRes;
  rentId: string;
  singleBoxDetailStatus: RentStatus;
  display: boolean;
}

const Edit = ({ selectedBoxId, user, rentId, singleBoxDetailStatus, display }: Props) => (
  <div className={`edit-wrapper ${display && 'show-me'}`}>
    <Alert text='application.changesIrreversible' type="primary" />
    {isAdmin(user.role) && <Status selectedBoxId={selectedBoxId} />}
    {isAdmin(user.role) && rentId !== '' && singleBoxDetailStatus === RentStatus.rented && <Position rentId={rentId} />}
    {isWorker(user.role) && <WorkerEdit rentId={rentId} selectedBoxId={selectedBoxId} />}
  </div>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Edit);
