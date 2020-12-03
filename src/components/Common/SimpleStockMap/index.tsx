import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../../reducers';
import { ReactComponent as ReactStockMap } from './ostrow_1.2.svg';

import './SimpleStockMap.scss';

interface Props {}

interface State {
  isMouseDown: boolean;
  grabStartX: number;
  grabStartY: number;
  scrollLeft: number;
  scrollTop: number;
  mapScale: number;
  mapMoveDistance: number;
  mapMoveHeight: number;
}

class SimpleStockMap extends React.Component<Props, State> {
  private element: React.RefObject<any>;

  constructor(props: Props) {
    super(props);
    this.element = React.createRef();
    this.state = {
      isMouseDown: false,
      grabStartX: 0,
      grabStartY: 0,
      scrollLeft: 0,
      scrollTop: 0,
      mapMoveDistance: 0,
      mapMoveHeight: 0,
      mapScale: 100,
    };
  }

  private mapScaleUpHandle = (e: any) => {
    e.stopPropagation();
    const mapWrapperElement = this.element.current;
    const { mapScale } = this.state;
    if (mapScale < 200) {
      const name = `scale-${mapScale}`;
      mapWrapperElement.classList.remove(name);
      this.setState({
        mapScale: mapScale + 10,
      });

      const newName = `scale-${mapScale + 10}`;
      mapWrapperElement.classList.add(newName);
    }
  };

  private mapScaleDownHandle = (e: any) => {
    e.stopPropagation();
    const mapWrapperElement = this.element.current;
    const { mapScale } = this.state;
    if (mapScale > 30) {
      const name = `scale-${mapScale}`;
      mapWrapperElement.classList.remove(name);

      this.setState({
        mapScale: mapScale - 10,
      });

      const newName = `scale-${mapScale - 10}`;
      mapWrapperElement.classList.add(newName);
    }
  };

  private handleTouchesDown = (e: TouchEvent | any, el: HTMLElement): any => {
    this.setState({
      isMouseDown: true,
      grabStartX: e.touches[0].pageX - el.offsetLeft,
      grabStartY: e.touches[0].pageY - el.offsetTop,
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop,
    });
    el.classList.add('grab');
  };

  private handleMouseDown = (e: MouseEvent, el: HTMLElement): any => {
    this.setState({
      isMouseDown: true,
      grabStartX: e.pageX - el.offsetLeft,
      grabStartY: e.pageY - el.offsetTop,
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop,
    });
    el.classList.add('grab');
  };

  private handleMouseUp = (e: MouseEvent, el: HTMLElement): any => {
    this.setState({
      isMouseDown: false,
    });
    el.classList.remove('grab');
  };

  private handleMouseLeave = (e: MouseEvent, el: HTMLElement): any => {
    this.setState({
      isMouseDown: false,
    });
    el.classList.remove('grab');
  };

  private handleMouseMove = (e: MouseEvent, el: HTMLElement): any => {
    const { isMouseDown, grabStartX, grabStartY, scrollLeft, scrollTop } = this.state;
    if (!isMouseDown) return;
    e.preventDefault();
    const mousePositionX = e.pageX - el.offsetLeft;
    const mousePositionY = e.pageY - el.offsetTop;
    const mapMoveDistance = mousePositionX - grabStartX;
    const mapMoveHeight = mousePositionY - grabStartY;

    el.scrollLeft = scrollLeft - mapMoveDistance;
    el.scrollTop = scrollTop - mapMoveHeight;
  };

  private handleTouchMove = (e: TouchEvent | any, el: HTMLElement): any => {
    const { isMouseDown, grabStartX, grabStartY, scrollLeft, scrollTop } = this.state;
    if (!isMouseDown) return;
    e.preventDefault();

    const mousePositionX = e.changedTouches[e.changedTouches.length - 1].pageX - el.offsetLeft;
    const mousePositionY = e.changedTouches[e.changedTouches.length - 1].pageX - el.offsetTop;
    const mapMoveDistance = mousePositionX - grabStartX;
    const mapMoveHeight = mousePositionY - grabStartY;

    this.setState({
      mapMoveDistance: scrollLeft - mapMoveDistance,
      mapMoveHeight: scrollTop - mapMoveHeight,
    });

    el.scrollLeft = scrollLeft - mapMoveDistance;
    el.scrollTop = scrollTop - mapMoveHeight;
  };

  public componentDidMount(): void {
    this.element.current.addEventListener(
      'mousedown',
      (e: MouseEvent) => this.handleMouseDown(e, this.element.current),
      false,
    );
    this.element.current.addEventListener(
      'touchstart',
      (e: MouseEvent) => this.handleTouchesDown(e, this.element.current),
      false,
    );

    this.element.current.addEventListener(
      'mouseup',
      (e: MouseEvent) => this.handleMouseUp(e, this.element.current),
      false,
    );
    // this.element.current.addEventListener(
    //   'touchend',
    //   (e: MouseEvent) => this.handleMouseUp(e, this.element.current),
    //   false,
    // );
    // this.element.current.addEventListener(
    //   'touchcancel',
    //   (e: MouseEvent) => this.handleMouseUp(e, this.element.current),
    //   false,
    // );

    this.element.current.addEventListener(
      'mouseleave',
      (e: MouseEvent) => this.handleMouseLeave(e, this.element.current),
      false,
    );

    this.element.current.addEventListener(
      'mousemove',
      (e: MouseEvent) => this.handleMouseMove(e, this.element.current),
      false,
    );
    this.element.current.addEventListener(
      'touchmove',
      (e: MouseEvent) => this.handleTouchMove(e, this.element.current),
      false,
    );
  }

  public componentWillUnmount(): void {
    this.element.current.removeEventListener(
      'mousedown',
      (e: MouseEvent) => this.handleMouseDown(e, this.element.current),
      false,
    );
    this.element.current.removeEventListener(
      'mouseup',
      (e: MouseEvent) => this.handleMouseUp(e, this.element.current),
      false,
    );
    this.element.current.removeEventListener(
      'mouseleave',
      (e: MouseEvent) => this.handleMouseLeave(e, this.element.current),
      false,
    );
    this.element.current.removeEventListener(
      'mousemove',
      (e: MouseEvent) => this.handleMouseMove(e, this.element.current),
      false,
    );
  }

  render() {
    const { mapScale } = this.state;
    return (
      <div className="map-wrapper scale-100" ref={this.element}>
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
        <ReactStockMap id="svg-map" />
      </div>
    );
  }
}

const mapStateToProps = (state: ApplicationState) => ({});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SimpleStockMap);
