/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../../reducers';
import { ReactComponent as ReactStockMap } from './ostrow_1.2.svg';

import './SimpleStockMap.scss';

interface State {
  isMouseDown: boolean;
  left: number;
  top: number;
  x: number;
  y: number;
  mapScale: number;
}

interface Props {
    map: string;
}

class SimpleStockMap extends React.Component<Props, State> {
  private element: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.element = React.createRef();
    this.state = {
      isMouseDown: false,
      left: 0,
      top: 0,
      x: 0,
      y: 0,
      mapScale: 100,
    };
  }

  private mapScaleUpHandle = (e: any) => {
    e.stopPropagation();
    const { mapScale } = this.state;
    if (mapScale < 300) {
      this.setState({
        mapScale: mapScale + 10,
      });
    }
  };

  private mapScaleDownHandle = (e: any) => {
    e.stopPropagation();
    const { mapScale } = this.state;
    if (mapScale > 30) {
      this.setState({
        mapScale: mapScale - 10,
      });
    }
  };

  private handleContainerTouchStart = (e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    const el = this.element.current;
    if (!el) return;
    const clientX =
      e.type === 'touchstart'
        ? (e as React.TouchEvent<HTMLDivElement>).touches[0].clientX
        : (e as React.MouseEvent<HTMLDivElement>).clientX;
    const clientY =
      e.type === 'touchstart'
        ? (e as React.TouchEvent<HTMLDivElement>).touches[0].clientY
        : (e as React.MouseEvent<HTMLDivElement>).clientY;
    this.setState({
      left: el.scrollLeft,
      top: el.scrollTop,
      x: clientX,
      y: clientY,
      isMouseDown: true,
    });
  };

  private handleContainerMove = (e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    const { left, top, x, y, isMouseDown } = this.state;

    if (!this.element || !this.element.current || !isMouseDown) return;

    const clientX =
      e.type === 'touchstart'
        ? (e as React.TouchEvent<HTMLDivElement>).touches[0].clientX
        : (e as React.MouseEvent<HTMLDivElement>).clientX;
    const clientY =
      e.type === 'touchstart'
        ? (e as React.TouchEvent<HTMLDivElement>).touches[0].clientY
        : (e as React.MouseEvent<HTMLDivElement>).clientY;

    const dx = clientX - x;
    const dy = clientY - y;

    this.element.current.scrollTop = top - dy;
    this.element.current.scrollLeft = left - dx;
  };

  private handleContainerUp = () => {
    this.setState({
      isMouseDown: false,
    });
  };

  render() {
    const { mapScale, isMouseDown } = this.state;
    const { map } = this.props;
    const base64data = btoa(unescape(encodeURIComponent(map)));
    return (
      <div className={`map-wrapper scale-${mapScale} ${isMouseDown ? 'grab' : ''}`}>
        <div className="map-scale">
          <span
            role="button"
            className={`fa fa-plus-circle ${mapScale === 200 ? 'max' : ''}`}
            onClick={this.mapScaleUpHandle}
          />
          <span
            role="button"
            className={`fa fa-minus-circle ${mapScale === 30 ? 'min' : ''}`}
            onClick={this.mapScaleDownHandle}
          />
        </div>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          ref={this.element}
          className="map-container"
          onTouchStart={this.handleContainerTouchStart}
          onMouseDown={this.handleContainerTouchStart}
          onMouseMove={this.handleContainerMove}
          onMouseUp={this.handleContainerUp}
        >
            <div id="svg-map" dangerouslySetInnerHTML={{__html: map}} />
          {/* <ReactStockMap id="svg-map" /> */}
          {/* <img id="svg-map" src={`data:image/svg+xml;base64,${base64data}`} /> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: ApplicationState) => ({});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SimpleStockMap);
