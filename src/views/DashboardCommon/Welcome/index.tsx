import React from 'react';
import { Section, SectionHeader } from '../../../components/Layout';
import { Carousel } from '../../../components/Common';
import History from './History';

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
        <History
          data={[
            {
              startData: new Date().toLocaleTimeString(),
              endData: new Date().toLocaleTimeString(),
              size: 12,
              location: 'Warszawa, Mokotów',
            },
            {
              startData: new Date().toLocaleTimeString(),
              endData: new Date().toLocaleTimeString(),
              size: 3,
              location: 'Wrocław, Fabryczna',
            },
            {
              startData: new Date().toLocaleTimeString(),
              endData: new Date().toLocaleTimeString(),
              size: 6,
              location: 'Poznań, Jeżyce',
            },
          ]}
        />
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
