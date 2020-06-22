import React from 'react';
import { Section, SectionHeader } from '../../../../components/Layout';
import Discounts from './Discounts';
import { __ } from '../../../../helpers/i18n';

const Sale = () => (
  <Section full>
    <SectionHeader title={__('application.discounts')} />
    <Discounts discounts={['-10% na pierwszy magazyn', 'Pierwszy tydzień za 1zł']} />
  </Section>
);

export default Sale;
