import React from 'react';
import { connect } from 'react-redux';
import { RentStatus, UserRes } from 'smartbox-types';
import { __ } from '../../../../../helpers/i18n';
import { ApplicationState } from '../../../../../reducers';
import { isAdmin, isWorker } from '../../../../../utils/role-check';

import Position from './Position';
import Status from './Status';
import WorkerEdit from './WorkerEdit';

interface Props {
  selectedBoxId: string;
  user: UserRes;
  rentId: string;
  singleBoxDetailStatus: RentStatus;
}

const Edit = ({ selectedBoxId, user, rentId, singleBoxDetailStatus }: Props) => (
  <div>
    <p>{__('application.changesIrreversible')}</p>
    {isAdmin(user.role) && <Status selectedBoxId={selectedBoxId} />}
    {isAdmin(user.role) && rentId !== '' && singleBoxDetailStatus === RentStatus.rented && (
      <Position selectedBoxId={selectedBoxId} rentId={rentId} />
    )}
    {isWorker(user.role) && <WorkerEdit rentId={rentId} singleBoxDetailStatus={singleBoxDetailStatus} />}
  </div>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Edit);
