import React from 'react';
import Form from './Form';
import { ButtonsContainer } from '../../../../components/Layout';
import { Button } from '../../../../components/Common';

const Detail = () => {
  console.log('Detail');
  return (
    <div>
      <h3>Szczegóły Profilu</h3>
      <ButtonsContainer>
        <Button text="Zmień hasło" primary />
      </ButtonsContainer>
      <Form />
    </div>
  );
};

export default Detail;
