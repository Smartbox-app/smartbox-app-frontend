import React from 'react';
import { Section, SectionHeader } from '../../../components/Layout';
import { Carousel } from '../../../components/Common';

const Welcome = () => {
  console.log('Home');
  return (
    <>
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
        <Carousel
          imagesList={[
            'http://placedog.net/200/300?random',
            'http://placedog.net/200/300?random',
            'http://placedog.net/200/300?random',
          ]}
        />
      </Section>
    </>
  );
};

export default Welcome;
