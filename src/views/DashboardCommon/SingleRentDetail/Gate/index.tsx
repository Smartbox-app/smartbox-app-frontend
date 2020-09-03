import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Coordinate } from 'smartbox-types';
import { Button } from '../../../../components/Common';
import { ApplicationState } from '../../../../reducers';
import { ButtonsContainer } from '../../../../components/Layout';
import { stock } from '../../../../actions';

interface Props {
  askGateToOpen: (geo: Coordinate) => void;
}

const Gate = ({ askGateToOpen }: Props) => {
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
    console.log(location);
  };

  const getLocation = () => {
    console.log('navigator', navigator.permissions);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log('Geo Location not supported by browser');
    }
  };
  // function that retrieves the position

  // request for location

  useEffect(() => {
    console.log('useEffect');
    getLocation();
  }, []);

  return (
    <div>
      <ButtonsContainer>
        <Button text="Otwórz bramę" click={() => askGateToOpen(geoCoord)} />
      </ButtonsContainer>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...stock,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Gate);
