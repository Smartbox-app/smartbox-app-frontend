import { darken } from 'polished';
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Moveable from 'react-moveable';
import styled, { css } from 'styled-components';

import {
  BoxMapRes,
  BoxMapUserRes,
  BoxStatus,
  RentStatus,
  StockRes,
} from 'smartbox-types';
import { Tooltip } from 'src/components/ui';
import { colorOrDark } from 'src/utils/color';

import { AdminBoxMapTooltipContent } from '../AdminBoxMapTooltipContent';
import { useMapLayoutContext } from '../MapLayoutContext';
import {
  BoxMapLayoutUpdate,
  getBoxHeight,
  getBoxWidth,
  getMapBoxFontSize,
  layoutFromMoveableRect,
  normalizeMapPosition,
} from '../utils/map-layout';

interface Props {
  box: BoxMapRes | BoxMapUserRes;
  stock: StockRes;
  highlightId?: string;
  admin?: boolean;
  user?: boolean;
  useGrid?: boolean;
  editable?: boolean;
  onBoxClick?: (box: BoxMapRes) => void;
}

const commonStyles = css`
  display: flex;
  color: ${(props) => colorOrDark(props.theme.colors.primary)};
  font-weight: 500;
  cursor: pointer;
`;

const boxChrome = css`
  border-radius: ${({ theme }) => theme.spacing * 2}px;
  box-shadow: ${({ theme }) => theme.shadows.box};
`;

const statusFill = (color: string) => css`
  background: linear-gradient(135deg, ${color}, ${darken(0.08, color)});
  border-color: transparent;
`;

const StyledDraggableContent = styled.div<{
  width?: number;
}>`
  background: #fff;
  border: 1px solid ${(props) => props.theme.colors.primary};
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  font-size: ${(props) => getMapBoxFontSize(props.width || 0)}px;
  text-align: center;
  ${boxChrome}
`;

const StyledBox = styled.div<{
  status: RentStatus | BoxStatus | null;
  stock: StockRes;
  user?: boolean;
  width?: number;
}>`
  // background: #fff;
  // border: 1px solid ${(props) => props.theme.colors.primary};
  font-size: ${(props) => getMapBoxFontSize(props.width || 0)}px;
  text-align: center;
  padding: 0.5px;
  ${commonStyles}
`;

const StyledContent = styled.div<{
  status: RentStatus | BoxStatus | null;
  stock: StockRes;
  user?: boolean;
  width?: number;
}>`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid ${(props) => props.theme.colors.primary};
  ${boxChrome}
  ${(props) =>
    props.status &&
    css`
      color: #fff;
    `}

${(props) =>
    props.status === BoxStatus.free &&
    css`
      ${statusFill(props.stock.colorFree)}
    `};
  ${(props) =>
    props.status === RentStatus.reserved &&
    css`
      ${statusFill(props.stock.colorReserved)}
    `};
  ${(props) =>
    !props.user &&
    props.status === RentStatus.rented &&
    css`
      ${statusFill(props.stock.colorRented)}
    `};
  ${(props) =>
    props.status === RentStatus.toExplain &&
    css`
      ${statusFill(props.stock.colorToExplain)}
    `};
  ${(props) =>
    props.status === RentStatus.toCheck &&
    css`
      ${statusFill(props.stock.colorToCheck)}
    `};
  ${(props) =>
    props.status === RentStatus.noPaidExtension &&
    css`
      ${statusFill(props.stock.colorNoPaidExtension)}
    `};
  ${(props) =>
    props.status === RentStatus.noPaidPeriod &&
    css`
      ${statusFill(props.stock.colorNoPaidPeriod)}
    `};
  ${(props) =>
    props.status === RentStatus.noPaidExtensionWithWarning &&
    css`
      ${statusFill(props.stock.colorNoPaidExtensionWithWarning)}
    `};
  ${(props) =>
    props.status === BoxStatus.outOfService &&
    css`
      ${statusFill(props.stock.colorOutOfService)}
    `};
  ${(props) =>
    props.status === RentStatus.finished &&
    css`
      ${statusFill(props.stock.colorFinished)}
    `};
  ${(props) =>
    props.status === RentStatus.failure &&
    css`
      ${statusFill(props.stock.colorFailure)}
    `};
  ${(props) =>
    (props.status === RentStatus.pendingFinish ||
      props.status === RentStatus.awaitingFinish) &&
    css`
      ${statusFill(props.stock.colorPendingFinish)}
    `};
  ${(props) =>
    props.status === RentStatus.endedUnpaid &&
    css`
      ${statusFill(props.stock.colorNoPaidPeriod)}
    `};

  ${(props) =>
    props.user &&
    props.status &&
    css`
      ${statusFill(props.theme.colors.success)}
    `}
`;

const SingleBox = ({
  box,
  stock,
  admin,
  user,
  highlightId,
  useGrid,
  editable,
  onBoxClick,
}: Props) => {
  const ref = useRef<Moveable>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  const mapLayoutContext = useMapLayoutContext();

  const style: CSSProperties = {
    position: 'absolute',
  };

  const getCurrentLayout = (): BoxMapLayoutUpdate | null => {
    const rect = ref.current?.getRect();
    if (!rect) return null;

    const { beforeOrigin, offsetHeight, offsetWidth, rotation } = rect;

    return layoutFromMoveableRect(
      beforeOrigin,
      offsetWidth,
      offsetHeight,
      rotation,
    );
  };

  const handleInteractionEnd = () => {
    const layout = getCurrentLayout();
    if (!layout) return;
    mapLayoutContext?.onLayoutChange(box.id, layout);
  };

  const handleDrop = (target: HTMLElement | SVGElement, transform: string) => {
    target.style.transform = transform;
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

  const handleBoxClick = () => {
    if (!onBoxClick) return;
    if (!admin) return;
    onBoxClick(box as BoxMapRes);
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setTarget(e.currentTarget);
  };

  const getBoxStatus = (box: BoxMapUserRes | BoxMapRes) => {
    if (user && highlightId === box.id) return RentStatus.rented;
    if (user) return null;
    return (box as BoxMapRes).status || BoxStatus.free;
  };

  const applyLayoutToElement = useCallback(() => {
    if (!boxRef.current) return;

    const width = getBoxWidth(box, stock);
    const height = getBoxHeight(box, stock);

    boxRef.current.style.width = `${width}px`;
    boxRef.current.style.height = `${height}px`;
    boxRef.current.style.left = `${box.x || 0}px`;
    boxRef.current.style.top = `${box.y || 0}px`;
    boxRef.current.style.transform = `rotate(${box.rotation || 0}deg)`;
    ref.current?.updateRect();
  }, [box, stock]);

  useEffect(() => {
    if (!editable) return;
    applyLayoutToElement();
  }, [editable, applyLayoutToElement]);

  useEffect(() => {
    if (!editable || !mapLayoutContext) return;

    const resetLayout = () => {
      setTarget(null);
      applyLayoutToElement();
    };

    mapLayoutContext.registerResetHandler(box.id, resetLayout);

    return () => {
      mapLayoutContext.unregisterResetHandler(box.id);
    };
  }, [editable, box.id, mapLayoutContext, applyLayoutToElement]);

  const handleClickOutside = (e: Event) => {
    const className = (e.target as Element | null)?.className;
    if (typeof className === 'string' && className.includes(`box-${box.id}`))
      return;

    setTarget(null);
  };

  useEffect(() => {
    if (!editable) return;

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [editable, box.id]);

  if (admin || user)
    return (
      <StyledBox
        status={getBoxStatus(box)}
        user={user}
        stock={stock}
        width={getBoxWidth(box, stock)}
        style={{
          position: 'absolute',
          left: normalizeMapPosition(box.x || 0, box.rotation || 0),
          top: normalizeMapPosition(box.y || 0, box.rotation || 0),
          width: getBoxWidth(box, stock),
          height: getBoxHeight(box, stock),
          transform: `rotate(${box.rotation || 0}deg)`,
        }}
        onClick={handleBoxClick}
      >
        <Tooltip
          disabled={!admin}
          content={
            admin ? <AdminBoxMapTooltipContent box={box as BoxMapRes} /> : null
          }
        >
          <StyledContent
            status={getBoxStatus(box)}
            user={user}
            stock={stock}
            width={getBoxWidth(box, stock)}
          >
            {box.identifier}
          </StyledContent>
        </Tooltip>
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
        <StyledDraggableContent
          width={getBoxWidth(box, stock)}
          className={`box-${box.id}-content`}
        >
          {box.identifier}
        </StyledDraggableContent>
      </div>
      <Moveable
        ref={ref}
        target={target}
        origin={true}
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
        onResizeEnd={() => handleInteractionEnd()}
        onDrag={({ target, transform }) => handleDrop(target, transform)}
        onDragEnd={() => handleInteractionEnd()}
        onRotate={({ target, transform }) => handleDrop(target, transform)}
        onRotateEnd={() => handleInteractionEnd()}
      />
    </div>
  );
};

export { SingleBox };
