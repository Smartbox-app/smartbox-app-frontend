import React from 'react';
import { connect } from 'react-redux';
import { UserRes, UserRole } from 'smartbox-types';
import { __ } from '../../../../../helpers/i18n';
import { ApplicationState } from '../../../../../reducers';

import Position from './Position';
import Status from './Status';
import WorkerEdit from './WorkerEdit';

interface Props {
  selectedBoxId: string;
  user: UserRes;
  rentId: string;
}

const Edit = ({ selectedBoxId, user, rentId }: Props) => (
  <div>
    <p>{__('application.changesIrreversible')}</p>
    {user.role === UserRole.admin && <Status selectedBoxId={selectedBoxId} />}
    {user.role === UserRole.admin && <Position selectedBoxId={selectedBoxId} rentId={rentId} />}
    {user.role === UserRole.worker && <WorkerEdit selectedBoxId={selectedBoxId} rentId={rentId} />}
  </div>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Edit);
