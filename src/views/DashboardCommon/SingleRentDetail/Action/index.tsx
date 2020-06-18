import React from 'react';
import { ButtonsContainer } from '../../../../components/Layout';
import { Button } from '../../../../components/Common';

const Action = () => (
  <ButtonsContainer>
    <Button text="Przedłuż" success />
    <Button text="Zakończ" danger />
  </ButtonsContainer>
);

export default Action;
