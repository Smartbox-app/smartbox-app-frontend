import React from 'react';
import { ButtonsContainer } from '../../../../components/Layout';
import { Button } from '../../../../components/Branded';

import './ButtonsSection.scss';

export const ButtonsSection = () => (
  <div className="resend-activation-buttons-section">
    <ButtonsContainer max column>
      <Button text='application.send' type="submit" big primary rounded />
      <Button text='application.back' to="/" big outline rounded />
    </ButtonsContainer>
  </div>
);