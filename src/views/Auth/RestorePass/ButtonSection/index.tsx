import React from 'react';

import { ButtonsContainer } from 'src/components/Layout';
import { Button } from 'src/components/ui';

interface Props {
  mainButtonText: string;
}

const ButtonsSection = ({ mainButtonText }: Props) => (
    <ButtonsContainer max column>
      <Button text={mainButtonText} size='large' variant='primary' type="submit" />
      <Button text='application.back' size='large' variant='secondary' to="/" />
    </ButtonsContainer>
);

export default ButtonsSection;
