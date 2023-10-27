import React from 'react';
import { ButtonsContainer, Section, SectionHeader } from '../../../../components/Layout';
import { Carousel } from '../../../../components/Common';
import { Button } from '../../../../components/Branded';

const index = () => (
  <Section half highlight>
    <ButtonsContainer spaceBetween>
      <SectionHeader title="application.offers" noMargin />

      <Button success small blank to="https://smartbox-storage.pl/jak-to-dziala/" text="application.how_it_works" />
    </ButtonsContainer>
    <Carousel imagesList={[3, 6, 9, 12]} />
  </Section>
);

export default index;
