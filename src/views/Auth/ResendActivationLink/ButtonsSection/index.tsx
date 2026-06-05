import React from 'react';
import { ButtonsContainer } from '../../../../components/Layout';
import { Button } from 'src/components/ui';

export const ButtonsSection = () => (
    <ButtonsContainer max column>
      <Button text='application.send' type="submit" variant='primary' size='large' />
      <Button text='application.back' to="/" variant='secondary' size='large' />
    </ButtonsContainer>
);