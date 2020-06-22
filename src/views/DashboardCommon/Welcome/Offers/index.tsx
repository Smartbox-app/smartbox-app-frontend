import React from 'react';
import { Section, SectionHeader } from '../../../../components/Layout';
import { Carousel } from '../../../../components/Common';
import { __ } from '../../../../helpers/i18n';

const index = () => (
  <Section half>
    <SectionHeader title={__('application.offers')} />
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
