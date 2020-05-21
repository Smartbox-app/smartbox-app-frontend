import React from 'react';
import { connect } from 'react-redux';

import { Section, SectionHeader } from '../../../components/Layout';
import { Carousel } from '../../../components/Common';

import History from './History';
import Discounts from './Discounts';
import StorageInfo from './StorageInfo';

import './Welcome.scss';

interface Props {
  userName: string;
}

const Welcome = ({ userName }: Props) => (
  <div className="welcome-wrapper">
    <Section full>
      <SectionHeader title={`Cześć ${userName}`} noMargin />
    </Section>
    <Section full>
      <SectionHeader title="Promocje" />
      <Discounts discounts={['-10% na pierwszy magazyn', 'Pierwszy tydzień za 1zł']} />
    </Section>
    <Section full>
      <SectionHeader title="Zarządaj magazynami" />
      <StorageInfo
        storageList={[
          {
            size: 12,
            location: 'Warszawa, Mokotów',
          },
          {
            size: 6,
            location: 'Wrocław, Fabryczna',
          },
          {
            size: 6,
            location: 'Wrocław, Fabryczna',
          },
          {
            size: 6,
            location: 'Wrocław, Fabryczna',
          },
          {
            size: 6,
            location: 'Wrocław, Fabryczna',
          },
          {
            size: 6,
            location: 'Wrocław, Fabryczna',
          },
        ]}
      />
    </Section>
    <Section half>
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
    <Section half>
      <SectionHeader title="Oferta" />
      <Carousel
        imagesList={[
          '/assets/images/dummy_box2.png',
          '/assets/images/dummy_box2.png',
          '/assets/images/dummy_box2.png',
          '/assets/images/dummy_box2.png',
        ]}
      />
    </Section>
  </div>
);

const mapStateToProps = (state: any) => ({
  userName: state.user.details.firstName,
});

export default connect(mapStateToProps)(Welcome);
