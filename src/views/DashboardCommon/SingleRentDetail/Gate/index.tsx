import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { bindActionCreators } from 'redux';
import { Coordinate } from 'smartbox-types';
import { Button } from '../../../../components/Common';
import { ApplicationState } from '../../../../reducers';
import { ButtonsContainer } from '../../../../components/Layout';
import { gate } from '../../../../actions';

import './Gate.scss';

interface Props {
  startAnimation: boolean;
  askGateToOpen: (geo: Coordinate) => void;
}

const Gate = ({ startAnimation, askGateToOpen }: Props) => {
  const [geoCoord, setGeoCoord] = useState({
    lon: '0',
    lat: '0',
  });

  const showPosition = (position: any) => {
    const location: Coordinate = {
      lon: position.coords.longitude,
      lat: position.coords.latitude,
    };
    setGeoCoord(location);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log('Geo Location not supported by browser');
    }
  };
  // function that retrieves the position

  // request for location

  useEffect(() => {
    getLocation();
  }, []);

  const noGpsCords = (
    <div className="no-gps-cords">
      <ReactSVG src="/assets/images/Group37.svg" />
      <span>Udostępnij swoją lokalizację by otworzyć bramę</span>
    </div>
  );

  const gateOpenningAnimation = (
    <div className="gate-animation">
      <ReactSVG src={`${startAnimation ? '/assets/images/Group46.svg' : '/assets/images/Group39.svg'}`} />
      <span>{startAnimation ? 'Brama otwarta' : 'Przesuń suwak aby otworzyć bramę'}</span>
      <div className="slide-to-open">
        <Button text="Otwórz bramę" big primary click={() => askGateToOpen(geoCoord)} disabled={startAnimation} />
      </div>
    </div>
  );

  return (
    <div className="open-gate-wrapper">
      <div className="animation-wrapper">{geoCoord.lat === '0' ? noGpsCords : gateOpenningAnimation}</div>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  startAnimation: state.gate.startAnimation,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...gate,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Gate);

{
  /*<ButtonsContainer max>*/
}
{
  /*  <Button*/
}
{
  /*    text="Otwórz bramę zdalnie"*/
}
{
  /*    big*/
}
{
  /*    rounded*/
}
{
  /*    tertiary*/
}
{
  /*    disabled={geoCoord.lat === '0'}*/
}
{
  /*    click={() => {*/
}
{
  /*      console.log('geoCoord', geoCoord);*/
}
{
  /*      askGateToOpen(geoCoord);*/
}
{
  /*    }}*/
}
{
  /*  />*/
}
{
  /*</ButtonsContainer>*/
}
