import { BoxMapRes, BoxMapUserRes, IStock, RentStatus } from 'smartbox-types';
import ApiService from '../../../../../../../services/api-service';
import styled, { css } from 'styled-components';
import { Rnd } from 'react-rnd';
import Moveable from 'react-moveable';
import { colorOrDark } from '../../../../../../../utils/color';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

interface Props {
  box: BoxMapRes | BoxMapUserRes;
  stock: IStock;
  highlightId?: string;
  admin?: boolean;
  user?: boolean;
  useGrid?: boolean;
  onBoxClick?: (box: BoxMapRes) => void;
}

const commonStyles = css`
  display: flex;
  color: ${(props) => colorOrDark(props.theme.colors.primary)};
  font-weight: 500;
  font-size: 0.8rem;
  cursor: pointer;
`;

const StyledDraggableBox = styled<typeof Moveable>(Moveable)`
  ${commonStyles}
`;

const StyledDraggableContent = styled('div')`
  background: #fff;
  border: 1px solid ${(props) => props.theme.colors.primary};
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const StyledBox = styled.div<{
  status: RentStatus | null;
  stock: IStock;
  user?: boolean;
}>`
  background: #fff;
  border: 1px solid ${(props) => props.theme.colors.primary};
  ${commonStyles}
  ${(props) =>
    props.status &&
    css`
      color: #fff;
    `}

${(props) =>
    props.status === RentStatus.free &&
    css`
      background-color: ${props.stock.colorFree};
    `};
  ${(props) =>
    props.status === RentStatus.reserved &&
    css`
      background-color: ${props.stock.colorReserved};
    `};
  ${(props) =>
    !props.user &&
    props.status === RentStatus.rented &&
    css`
      background-color: ${props.stock.colorRented};
    `};
  ${(props) =>
    props.status === RentStatus.toExplain &&
    css`
      background-color: ${props.stock.colorToExplain};
    `};
  ${(props) =>
    props.status === RentStatus.toCheck &&
    css`
      background-color: ${props.stock.colorToCheck};
    `};
  ${(props) =>
    props.status === RentStatus.noPaidExtension &&
    css`
      background-color: ${props.stock.colorNoPaidExtension};
    `};
  ${(props) =>
    props.status === RentStatus.noPaidPeriod &&
    css`
      background-color: ${props.stock.colorNoPaidPeriod};
    `};
  ${(props) =>
    props.status === RentStatus.noPaidExtensionWithWarning &&
    css`
      background-color: ${props.stock.colorNoPaidExtensionWithWarning};
    `};
  ${(props) =>
    props.status === RentStatus.outOfService &&
    css`
      background-color: ${props.stock.colorOutOfService};
    `};
  ${(props) =>
    props.status === RentStatus.finished &&
    css`
      background-color: ${props.stock.colorFinished};
    `};
  ${(props) =>
    props.status === RentStatus.failure &&
    css`
      background-color: ${props.stock.colorFailure};
    `};

  ${(props) =>
    props.user &&
    props.status &&
    css`
      background-color: ${props.theme.colors.success};
    `}
`;

const StyledContent = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledRotateButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
`;

const SingleBox = ({
  box,
  stock,
  admin,
  user,
  highlightId,
  useGrid,
  onBoxClick,
}: Props) => {
  const ref = useRef<Moveable>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState<number>(box.rotation || 0);
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  const normalizePosition = (position: number, rotation: number) => {
    if (rotation !== 0) return position;

    const rest = position % 5;
    return rest > 2 ? position + (5 - rest) : position - rest;
  };

  const style: CSSProperties = {
    position: 'absolute',
  };

  const normalizeWidth = (box: BoxMapRes | BoxMapUserRes) => {
    if (box.width) return box.width;
    if (!box.groupWidth) return 50;
    const ratio = stock.mapWidth / stock.mapWidthMeters;
    return Math.round(box.groupWidth * ratio);
  };

  const normalizeHeight = (box: BoxMapRes | BoxMapUserRes) => {
    if (box.height) return box.height;
    if (!box.groupHeight) return 50;
    const ratio = stock.mapHeight / stock.mapHeightMeters;
    return Math.round(box.groupHeight * ratio);
  };

  const updatePosition = async (x: number, y: number) => {
    await ApiService.callFetch(
      'PATCH',
      `box/position/${box.id}`,
      () => {},
      null,
      { x, y },
    );
  };

  const updateRotation = async (rotation: number) => {
    await ApiService.callFetch(
      'PATCH',
      `box/rotation/${box.id}`,
      () => {},
      null,
      { rotation },
    );
  };

  const updateSize = async (width: number, height: number) => {
    await ApiService.callFetch('PATCH', `box/size/${box.id}`, () => {}, null, {
      width,
      height,
    });
  };

  const handleDrop = (target: HTMLElement | SVGElement, transform: string) => {
    target.style.transform = transform;
  };

  const handleMoveUpdate = () => {
    const rect = ref.current?.getRect();

    if (!rect) return;
    const { beforeOrigin, offsetHeight, offsetWidth } = rect;
    updatePosition(
      Math.round(beforeOrigin[0] - offsetWidth / 2),
      Math.round(beforeOrigin[1] - offsetHeight / 2),
    );
  };

  const handleResize = (
    target: HTMLElement | SVGElement,
    transform: string,
    width: number,
    height: number,
  ) => {
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;
    target.style.transform = transform;
  };

  const handleResizeUpdate = (width: number, height: number) => {
    updateSize(Math.round(width), Math.round(height));
  };

  const handleBoxClick = () => {
    if (!onBoxClick) return;
    if (!admin) return;
    onBoxClick(box as BoxMapRes);
  };

  const onMouseDown = (e) => {
    const nativeEvent = e.nativeEvent;
    setTarget(nativeEvent.target);
  };

  const getBoxStatus = (box: BoxMapUserRes | BoxMapRes) => {
    if (user && highlightId === box.id) return RentStatus.rented;
    if (user) return null;
    return (box as BoxMapRes).status || RentStatus.free;
  };

  const getNewRotation = (previous: number, change: number) => {
    const newRotation = previous + change;
    if (newRotation > 360) return 0;
    if (newRotation < 0) return 360;
    return newRotation;
  };

  const rotate = (
    target: HTMLElement | SVGElement,
    transform: string,
    deg: number,
  ) => {
    target.style.transform = transform;
    const newRotation = getNewRotation(rotation, deg);
    setRotation(newRotation);
  };

  const handleRotationUpdate = () => {
    updateRotation(rotation);
  };

  useEffect(() => {
    if (!box || !boxRef || !boxRef.current) return;

    boxRef.current.style.width = `${normalizeWidth(box)}px`;
    boxRef.current.style.height = `${normalizeHeight(box)}px`;
    boxRef.current.style.left = `${box.x || 0}px`;
    boxRef.current.style.top = `${box.y || 0}px`;
    boxRef.current.style.transform = `rotate(${box.rotation || 0}deg)`;
  }, [ref, box]);

  const handleClickOutside = (e: Event) => {
    const target = e.target as HTMLElement;

    console.log('EVENT', e);
    if (target.className.includes(`box-${box.id}`)) return;

    setTarget(null);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (admin || user)
    return (
      <StyledBox
        status={getBoxStatus(box)}
        user={user}
        stock={stock}
        style={{
          position: 'absolute',
          left: normalizePosition(box.x || 0, box.rotation || 0),
          top: normalizePosition(box.y || 0, box.rotation || 0),
          width: normalizeWidth(box),
          height: normalizeHeight(box),
          transform: `rotate(${box.rotation || 0}deg)`,
        }}
        onClick={handleBoxClick}
      >
        <StyledContent>{box.identifier}</StyledContent>
      </StyledBox>
    );

  return (
    <div>
      <div
        className={`box-${box.id}`}
        style={style}
        onMouseDown={onMouseDown}
        ref={boxRef}
      >
        <StyledDraggableContent className={`box-${box.id}-content`}>
          {box.identifier}
        </StyledDraggableContent>
      </div>
      <Moveable
        ref={ref}
        target={target}
        origin={true}
        // snappable={true}
        edge={false}
        draggable={true}
        throttleDrag={useGrid ? 5 : 0}
        resizable={true}
        throttleResize={useGrid ? 5 : 0}
        rotatable={true}
        throttleRotate={useGrid ? 5 : 0}
        onResize={({ target, transform, width, height }) =>
          handleResize(target, transform, width, height)
        }
        onResizeEnd={({ target }) =>
          handleResizeUpdate(target.clientWidth, target.clientHeight)
        }
        onDrag={({ target, transform }) => handleDrop(target, transform)}
        onDragEnd={({ clientX, clientY }) => handleMoveUpdate()}
        onRotate={({ target, transform, delta }) =>
          rotate(target, transform, delta)
        }
        onRotateEnd={() => handleRotationUpdate()}
        // default={{
        //   x: normalizePosition(box.x || 0),
        //   y: normalizePosition(box.y || 0),
        //   width: normalizeWidth(box),
        //   height: normalizeHeight(box),
        // }}
        // bounds="parent"
        // onClick={handleBoxClick}
      />
    </div>
  );
};

export { SingleBox };
