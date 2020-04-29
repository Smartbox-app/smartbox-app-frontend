import React from 'react';
import { Section, SectionHeader } from '../../../components/Layout';

const Welcome = () => {
  console.log('Home');
  return (
    <div>
      <p>Cześć, Userze</p>
      <Section>
        <SectionHeader title="Promocje" />
        <p>Tutaj powinny się pojawic promocje</p>
      </Section>
      <Section>
        <SectionHeader title="Historia" />
        <p>Tutaj powinny się pojawiać historia</p>
      </Section>
      <Section>
        <SectionHeader title="Oferta" />
        <p>Tutaj pojawi się karuzela</p>
      </Section>
    </div>
  );
};

export default Welcome;
