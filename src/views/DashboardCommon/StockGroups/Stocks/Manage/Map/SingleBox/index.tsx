import { BoxMapRes, BoxMapUserRes, IStock, RentStatus } from "smartbox-types";
import ApiService from "../../../../../../../services/api-service";
import styled, { css } from "styled-components";
import { Rnd } from "react-rnd";
import { colorOrDark } from "../../../../../../../utils/color";
import { useRef, useState } from "react";

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

const StyledDraggableBox = styled<typeof Rnd>(Rnd)`
  ${commonStyles}
`;

const StyledDraggableContent = styled("div")`
  background: #fff;
  border: 1px solid ${(props) => props.theme.colors.primary};
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  const ref = useRef();
  const [rotation, setRotation] = useState<number>(box.rotation || 0);
  const normalizePosition = (position: number) => {
    const rest = position % 5;
    return rest > 2 ? position + (5 - rest) : position - rest;
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
      "PATCH",
      `box/position/${box.id}`,
      () => {},
      null,
      { x, y }
    );
  };

  const updateRotation = async (rotation: number) => {
    await ApiService.callFetch(
      "PATCH",
      `box/rotation/${box.id}`,
      () => {},
      null,
      { rotation }
    );
  };

  const updateSize = async (width: number, height: number) => {
    await ApiService.callFetch("PATCH", `box/size/${box.id}`, () => {}, null, {
      width,
      height,
    });
  };

  const handleDrop = (e, ui) => {
    updatePosition(ui.x, ui.y);
  };

  const handleResize = (_, __, ref: HTMLElement) => {
    updateSize(parseInt(ref.style.width), parseInt(ref.style.height));
  };

  const handleBoxClick = () => {
    if (!onBoxClick) return;
    if (!admin) return;
    onBoxClick(box as BoxMapRes);
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

  const rotate = (deg: number) => {
    console.log('REF');
    const newRotation = getNewRotation(rotation, deg);
    setRotation(newRotation);
    updateRotation(newRotation);
  };

  if (admin || user)
    return (
      <StyledBox
        status={getBoxStatus(box)}
        user={user}
        stock={stock}
        style={{
          position: "absolute",
          left: normalizePosition(box.x || 0),
          top: normalizePosition(box.y || 0),
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
    <StyledDraggableBox
      ref={ref}
      disabledDragging={true}
      resizeGrid={useGrid ? [5, 5] : undefined}
      dragGrid={useGrid ? [5, 5] : undefined}
      onDragStop={handleDrop}
      onResizeStop={handleResize}
      default={{
        x: normalizePosition(box.x || 0),
        y: normalizePosition(box.y || 0),
        width: normalizeWidth(box),
        height: normalizeHeight(box),
      }}
      bounds="parent"
      onClick={(handleBoxClick)}
    >
      <StyledDraggableContent style={{ transform: `rotate(${rotation}deg)` }}>
        <StyledRotateButton onClick={() => rotate(-5)}>
          <span className="fa fa-rotate-left" />
        </StyledRotateButton>
        {box.identifier}
        <StyledRotateButton onClick={() => rotate(5)}>
          <span className="fa fa-rotate-right" />
        </StyledRotateButton>
      </StyledDraggableContent>
    </StyledDraggableBox>
  );
};

export { SingleBox };
