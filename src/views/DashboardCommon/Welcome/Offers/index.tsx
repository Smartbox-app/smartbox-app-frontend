import React from 'react';
import { Section, SectionHeader } from '../../../../components/Layout';
import { Carousel } from '../../../../components/Common';
import { __ } from '../../../../helpers/i18n';

const index = () => (
  <Section half highlight>
    <SectionHeader title={__('application.offers')} />
    <Carousel imagesList={[3, 6, 9, 12]} />
  </Section>
);

export default index;
