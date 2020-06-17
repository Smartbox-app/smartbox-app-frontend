import React from 'react';
import { ButtonsContainer } from '../../../components/Layout';
import { Button } from '../../../components/Common';

import './ButtonSection.scss';

interface Props {
  mainButtonText: string;
}

const ButtonsSection = ({ mainButtonText }: Props) => (
  <div className="login-buttons-section">
    <ButtonsContainer max column>
      <Button text={mainButtonText} big type="submit" primary rounded />
      <Button text="Wróć" big outline rounded to="/" />
    </ButtonsContainer>
  </div>
);

export default ButtonsSection;
