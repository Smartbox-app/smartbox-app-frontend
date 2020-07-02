import React from 'react';
import { Section, SectionHeader } from '../../../../components/Layout';
import { Carousel } from '../../../../components/Common';
import { __ } from '../../../../helpers/i18n';

const index = () => (
  <Section half>
    <SectionHeader title={__('application.offers')} />
    <Carousel imagesList={['3c', '6c', '9c', '12c']} />
  </Section>
);

export default index;
