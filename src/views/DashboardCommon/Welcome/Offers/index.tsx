import React from 'react';
import { Section, SectionHeader } from '../../../../components/Layout';
import { Carousel } from '../../../../components/Common';

const index = () => (
  <Section half highlight>
    <SectionHeader title='application.offers'/>
    <Carousel imagesList={[3, 6, 9, 12]} />
  </Section>
);

export default index;
