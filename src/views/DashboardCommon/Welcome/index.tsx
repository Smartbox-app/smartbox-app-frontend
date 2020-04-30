import React from 'react';
import { Section, SectionHeader } from '../../../components/Layout';
import { Carousel } from '../../../components/Common';
import History from './History';
import Discounts from './Discounts';

const Welcome = () => {
  console.log('Home');
  return (
    <>
      <p>Cześć, Userze</p>
      <Section>
        <SectionHeader title="Promocje" />
        <Discounts discounts={['-10% na pierwszy magazyn', 'Pierwszy tydzień za 1zł']} />
      </Section>
      <Section>
        <SectionHeader title="Zarządaj magazynami" />
        <p>Tutaj powinny się pojawic magazyny</p>
      </Section>
      <Section>
        <SectionHeader title="Historia" />
        <History
          data={[
            {
              startData: new Date(),
              endData: new Date(),
              size: 12,
              location: 'Warszawa, Mokotów',
              isActive: true,
            },
            {
              startData: new Date(),
              endData: new Date(),
              size: 3,
              location: 'Wrocław, Fabryczna',
              isActive: false,
            },
            {
              startData: new Date(),
              endData: new Date(),
              size: 6,
              location: 'Poznań, Jeżyce',
              isActive: false,
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
