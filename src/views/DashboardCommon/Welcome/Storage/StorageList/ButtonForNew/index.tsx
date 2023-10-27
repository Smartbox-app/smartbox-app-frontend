import React from 'react';
import {  useSelector } from 'react-redux';
import { Button } from '../../../../../../components/Branded';
import UserService from '../../../../../../services/user-service';
import { ApplicationState } from '../../../../../../reducers';

import './ButtonForNew.scss';

const ButtonForNew = () => {
    const user = useSelector((state: ApplicationState) => state.user.details!);
    <div className="new-storage single-wrapper">
        <Button
            text='application.newStock'
            outline
            icon="plus.svg"
            to={`/${UserService.getSlugByRole(user.role)}/order/step/stock`}
        />
    </div>
}

export default ButtonForNew;
