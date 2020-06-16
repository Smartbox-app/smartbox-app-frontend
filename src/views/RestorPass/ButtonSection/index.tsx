import React from 'react';
import { ButtonsContainer } from '../../../components/Layout';
import { Button } from '../../../components/Common';

import './ButtonSection.scss';

const ButtonsSection = () => (
  <div className="login-buttons-section">
    <ButtonsContainer max column>
      <Button text="Przypomnij hasło" big type="submit" primary rounded />
      <Button text="Wróć" big outline rounded to="/" />
    </ButtonsContainer>
  </div>
);

export default ButtonsSection;
