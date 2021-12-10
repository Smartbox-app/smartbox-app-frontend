import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { bindActionCreators } from 'redux';
import { Coordinate, UserRes } from 'smartbox-types';
import { Button } from '../../../../components/Common';
import { __ } from '../../../../helpers/i18n';
import { ApplicationState } from '../../../../reducers';
import { gate } from '../../../../actions';
import { isUser } from '../../../../utils/role-check';

import './Gate.scss';

interface Props {
  startAnimation: boolean;
  user: UserRes;
  stockId: string;
  askGateToOpen: (geo: Coordinate) => void;
  askGateToOpenStuff: (stockId: string) => void;
  gateOpenStartAnimation: (open?: boolean) => void;
}

const Gate = ({ startAnimation, user, stockId, askGateToOpen, askGateToOpenStuff, gateOpenStartAnimation }: Props) => {
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

  useEffect(() => {
    isUser(user.role) && getLocation();
    gateOpenStartAnimation(false);
  }, []);

  const noGpsCords = (
    <div className="no-gps-cords">
      <ReactSVG src="/assets/images/Group37.svg" />
      <span>{__('application.shareYourLoc')}</span>
    </div>
  );

  const getButtonText = () => {
    if (startAnimation) {
      return 'application.openingGate'
    }

    return isUser(user.role) ? 'application.openGate' : 'application.openGateStuff'
  };

  const gateOpenningAnimation = (
    <div className="gate-animation">
      <ReactSVG src={`${startAnimation ? '/assets/images/Group46.svg' : '/assets/images/Group39.svg'}`} />
      <div className="slide-to-open">
        <Button
          text={getButtonText()}
          big
          primary
          click={() => (isUser(user.role) ? askGateToOpen(geoCoord) : askGateToOpenStuff(stockId))}
          disabled={isUser(user.role) ? startAnimation : false}
        />
      </div>
    </div>
  );
  if (!isUser(user.role)) {
    return <div className="open-gate-wrapper">{gateOpenningAnimation}</div>;
  }
  return (
    <div className="open-gate-wrapper">
      <div className="animation-wrapper">{geoCoord.lat === '0' ? noGpsCords : gateOpenningAnimation}</div>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  startAnimation: state.gate.startAnimation,
  user: state.user.details,
  stockId: state.stock.list[0]?.id,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...gate,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Gate);
