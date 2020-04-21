// homepage view - example

import React from 'react';
import { Main, ButtonsContainer, FormContainer } from '../../components/Layout';
import { __ } from '../../helpers/i18n';
import { Button, Spinner, Input, CheckBox } from '../../components/Common';

import './Home.scss';

const Home = () => (
  <div className="mood-wrapper">
    <Main>
      <h1>{__('application.welcome')}</h1>
      <ButtonsContainer>
        <Button text="Potwierdz" success />
        <Button text="Potwierdz" success onlyIcon icon="arrow-down.svg" />
        <Button text="Potwierdz" success onlyIcon icon="arrow-down.svg" rounded />
        <Button text="Potwierdz" success icon="arrow-down.svg" />
        <Button text="Potwierdz" success small />
        <Button text="Potwierdz" success big />
        <Button text="Potwierdz" success rounded />
      </ButtonsContainer>
      <ButtonsContainer>
        <Button text="Potwierdz" primary />
        <Button text="Potwierdz" primary onlyIcon icon="iconmonstr-gear-1.svg" />
        <Button text="Potwierdz" primary onlyIcon icon="iconmonstr-gear-1.svg" rounded />
        <Button text="Potwierdz" primary icon="iconmonstr-gear-1.svg" />
        <Button text="Potwierdz" primary small />
        <Button text="Potwierdz" primary big />
        <Button text="Potwierdz" primary rounded />
      </ButtonsContainer>
      <ButtonsContainer>
        <Button text="Potwierdz" danger />
        <Button text="Potwierdz" danger onlyIcon icon="iconmonstr-gear-1.svg" />
        <Button text="Potwierdz" danger onlyIcon icon="iconmonstr-gear-1.svg" rounded />
        <Button text="Potwierdz" danger small />
        <Button text="Potwierdz" danger big />
        <Button text="Potwierdz" danger rounded />
      </ButtonsContainer>
      <ButtonsContainer>
        <Button text="Potwierdz" outline />
        <Button text="Potwierdz" outline onlyIcon icon="iconmonstr-gear-1.svg" />
        <Button text="Potwierdz" outline onlyIcon icon="iconmonstr-gear-1.svg" rounded />
        <Button text="Potwierdz" outline small />
        <Button text="Potwierdz" outline big />
        <Button text="Potwierdz" outline rounded />
      </ButtonsContainer>
      <Spinner />
      <FormContainer>
        <Input
          type="text"
          input={{
            label: 'label-text',
            name: 'text',
            id: 'text',
            placeholder: 'placeholder-text',
          }}
        />
        <Input
          type="select"
          options={[
            {
              value: 123,
              name: 'text-1',
            },
            {
              value: 123,
              name: 'text-2',
            },
          ]}
          input={{
            label: 'label-select',
            name: 'select',
            id: 'select',
            placeholder: 'placeholder-select',
          }}
        />
        <CheckBox name="test" checked label="Potwierdzam" handleChange={() => {}} />
        <CheckBox name="test" checked={false} label="Potwierdzam" handleChange={() => {}} />
      </FormContainer>
    </Main>
  </div>
);

export default Home;
