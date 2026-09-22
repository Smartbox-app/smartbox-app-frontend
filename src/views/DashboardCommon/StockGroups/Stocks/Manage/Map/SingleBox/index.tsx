import { BoxMapRes, BoxMapUserRes, BoxStatus, RentStatus, StockRes } from 'smartbox-types';
import styled, { css } from 'styled-components';
import Moveable from 'react-moveable';
import { colorOrDark } from '../../../../../../../utils/color';
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import {
  BoxMapLayoutUpdate,
  getBoxHeight,
  getBoxWidth,
} from '../utils/map-layout';
import { useMapLayoutContext } from '../MapLayoutContext';
import { Tooltip } from 'src/components/ui';
import { getAdminBoxMapTooltipContent } from '../utils/admin-box-tooltip';

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

const getFontSize = (width: number) => {
  if (width > 80) return 13;
  if (width > 60) return 12;
  if (width > 50) return 11;
  return 10;
};

const commonStyles = css`
  display: flex;
  color: ${(props) => colorOrDark(props.theme.colors.primary)};
  font-weight: 500;
  cursor: pointer;
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
  font-size: ${(props) => getFontSize(props.width || 0)}px;
  text-align: center';
`;

const StyledBox = styled.div<{
  status: RentStatus | BoxStatus | null;
  stock: StockRes;
  user?: boolean;
  width?: number;
}>`
  background: #fff;
  border: 1px solid ${(props) => props.theme.colors.primary};
  font-size: ${(props) => getFontSize(props.width || 0)}px;
  text-align: center;
  ${commonStyles}
  ${(props) =>
    props.status &&
    css`
      color: #fff;
    `}

${(props) =>
    props.status === BoxStatus.free &&
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
    props.status === BoxStatus.outOfService &&
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
    props.status === RentStatus.pendingFinish &&
    css`
      background-color: ${props.stock.colorPendingFinish};
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

  const normalizePosition = (position: number, rotation: number) => {
    if (rotation !== 0) return position;

    const rest = position % 5;
    return rest > 2 ? position + (5 - rest) : position - rest;
  };

  const style: CSSProperties = {
    position: 'absolute',
  };

  const getCurrentLayout = (): BoxMapLayoutUpdate | null => {
    const rect = ref.current?.getRect();
    if (!rect) return null;

    const { beforeOrigin, offsetHeight, offsetWidth, rotation } = rect;

    return {
      x: Math.round(beforeOrigin[0] - offsetWidth / 2),
      y: Math.round(beforeOrigin[1] - offsetHeight / 2),
      width: Math.round(offsetWidth),
      height: Math.round(offsetHeight),
      rotation: Math.round(rotation),
    };
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
    const eventTarget = e.target as HTMLElement;

    if (eventTarget.className.includes(`box-${box.id}`)) return;

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
          left: normalizePosition(box.x || 0, box.rotation || 0),
          top: normalizePosition(box.y || 0, box.rotation || 0),
          width: getBoxWidth(box, stock),
          height: getBoxHeight(box, stock),
          transform: `rotate(${box.rotation || 0}deg)`,
        }}
        onClick={handleBoxClick}
      >
        <Tooltip
          disabled={!admin}
          content={
            admin ? getAdminBoxMapTooltipContent(box as BoxMapRes) : null
          }
        >
          <StyledContent>{box.identifier}</StyledContent>
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
