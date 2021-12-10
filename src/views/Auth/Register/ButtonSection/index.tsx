import React from 'react';
import { ButtonsContainer } from '../../../../components/Layout';
import { Button } from '../../../../components/Common';
import { __ } from '../../../../helpers/i18n';

import './ButtonSection.scss';

const ButtonSection = () => (
  <div className="register-buttons-section">
    <ButtonsContainer max column>
      <Button text='application.send' type="submit" big primary rounded className="register-control-button" />
      <Button text='application.back' to="/" big outline rounded className="register-control-button" />
    </ButtonsContainer>
  </div>
);

export default ButtonSection;
