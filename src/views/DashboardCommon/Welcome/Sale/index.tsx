import React from 'react';
import { Section, SectionHeader } from '../../../../components/Layout';
import Discounts from './Discounts';

const Sale = () => (
  <Section full>
    <SectionHeader title="Promocje" />
    <Discounts discounts={['-10% na pierwszy magazyn', 'Pierwszy tydzień za 1zł']} />
  </Section>
);

export default Sale;
