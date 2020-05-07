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
  <>
    <Section>
      {/* <SectionHeader title={`Cześć ${userName}`} noMargin /> */}
      <h3 className="no-margin welcome">Cześć, {userName}!</h3>
    </Section>
    <Section>
      <SectionHeader title="Promocje" />
      <Discounts discounts={['-10% na pierwszy magazyn', 'Pierwszy tydzień za 1zł']} />
    </Section>
    <Section>
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
        ]}
      />
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

const mapStateToProps = (state: any) => ({
  userName: state.user.details.firstName,
});

export default connect(mapStateToProps)(Welcome);
