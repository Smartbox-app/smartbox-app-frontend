import React from 'react';
import { Section, SectionHeader } from '../../../../components/Layout';
import { Carousel } from '../../../../components/Common';

const index = () => (
  <Section half>
    <SectionHeader title="Oferta" />
    <Carousel
      imagesList={[
        '/assets/images/dummy_box2.png',
        '/assets/images/dummy_box2.png',
        '/assets/images/dummy_box2.png',
        '/assets/images/dummy_box2.png',
      ]}
    />
  </Section>
);

export default index;
