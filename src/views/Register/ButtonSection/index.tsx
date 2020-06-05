import React from 'react';
import { ButtonsContainer } from '../../../components/Layout';
import { Button } from '../../../components/Common';

import './ButtonSection.scss';

const ButtonSection = () => (
  <ButtonsContainer max column>
    <Button text="Wyślij" type="submit" big primary rounded className="register-control-button" />
    <Button text="Wróć" to="/" big outline rounded className="register-control-button" />
  </ButtonsContainer>
);

export default ButtonSection;
