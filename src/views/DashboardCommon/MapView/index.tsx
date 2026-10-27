import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';

import { BoxMapLayoutItem, BoxMapRes, BoxMapUserRes, StockRes } from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { Button } from 'src/components/Branded';
import { CheckBox } from 'src/components/Common';
import { ButtonsContainer } from 'src/components/Layout';
import { useFileStorage } from 'src/hooks/useFileStorage';
import { useI18n } from 'src/i18n';
import { useUpdateBoxesMapLayoutMutation } from 'src/mutations';
import { MapGrid } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Map/MapGrid';
import { MapLayoutContext } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Map/MapLayoutContext';
import { SingleBox } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Map/SingleBox';
import {
  BoxMapLayoutUpdate,
  getBoxLayoutFromBox,
  isSameBoxLayout,
} from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Map/utils/map-layout';

interface Props {
  boxes: (BoxMapRes | BoxMapUserRes)[];
  stock: StockRes;
  onBoxClick?: (box: BoxMapRes) => void;
  highlightId?: string;
  admin?: boolean;
  user?: boolean;
}

const StyledMapOuterContainer = styled.div`
  overflow: auto;
  width: 100%;
`;

const StyledMapContainer = styled.div<{
  height: number;
  width: number;
  backgroundUrl: string | null;
}>`
  position: relative;
  border: 1px solid ${(props) => props.theme.colors.primary};
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  overflow: hidden;
  margin: 0 auto;
  border-radius: 5px;
  ${(props) =>
    props.backgroundUrl &&
    css`
      background-image: url(${props.backgroundUrl});
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    `}
  background-color: #fff;
`;

const StyledMapActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const MapView = ({
  boxes,
  stock,
  admin,
  user,
  highlightId,
  onBoxClick,
}: Props) => {
  const { getAssetPath } = useFileStorage();
  const [useGrid, setUseGrid] = useState<boolean>(true);
  const [pendingLayouts, setPendingLayouts] = useState<
    Record<string, BoxMapLayoutUpdate>
  >({});
  const resetHandlersRef = useRef(new Map<string, () => void>());
  const { t } = useI18n();
  const dispatch = useDispatch();
  const { mutateAsync: saveMapLayout, isPending: isSaving } =
    useUpdateBoxesMapLayoutMutation(stock.id);

  const editable = !admin && !user;

  const handleChange = () => {
    setUseGrid((prev) => !prev);
  };

  const mapBackgroundUrl = stock.mapBackground ? getAssetPath('map', stock.mapBackground) : null;

  const filteredBoxes = boxes.filter((box, index) => {
    const lastIndex = boxes.findLastIndex((subBox) => box.id === subBox.id);

    if (lastIndex === index) return true;
    return false;
  });

  const originalLayouts = useMemo(
    () =>
      Object.fromEntries(
        filteredBoxes.map((box) => [box.id, getBoxLayoutFromBox(box, stock)]),
      ),
    [filteredBoxes, stock],
  );

  const handleLayoutChange = useCallback(
    (boxId: string, layout: BoxMapLayoutUpdate) => {
      const originalLayout = originalLayouts[boxId];
      if (!originalLayout) return;

      setPendingLayouts((previous) => {
        const next = { ...previous };

        if (isSameBoxLayout(originalLayout, layout)) {
          delete next[boxId];
        } else {
          next[boxId] = layout;
        }

        return next;
      });
    },
    [originalLayouts],
  );

  const pendingBoxes = useMemo<BoxMapLayoutItem[]>(
    () =>
      Object.entries(pendingLayouts).map(([id, layout]) => ({
        id,
        ...layout,
      })),
    [pendingLayouts],
  );

  const hasPendingChanges = pendingBoxes.length > 0;

  const registerResetHandler = useCallback((boxId: string, handler: () => void) => {
    resetHandlersRef.current.set(boxId, handler);
  }, []);

  const unregisterResetHandler = useCallback((boxId: string) => {
    resetHandlersRef.current.delete(boxId);
  }, []);

  const resetAllLayouts = useCallback(() => {
    resetHandlersRef.current.forEach((handler) => handler());
  }, []);

  const mapLayoutContextValue = useMemo(
    () => ({
      onLayoutChange: handleLayoutChange,
      registerResetHandler,
      unregisterResetHandler,
    }),
    [handleLayoutChange, registerResetHandler, unregisterResetHandler],
  );

  const handleCancel = () => {
    setPendingLayouts({});
    resetAllLayouts();
  };

  const handleSave = async () => {
    if (!hasPendingChanges) return;

    await saveMapLayout(pendingBoxes);
    setPendingLayouts({});
    dispatch(successNotification(t('application.mapLayoutSaved')));
  };

  return (
    <div>
      <StyledMapActions>
        {!admin && !user ? (
          <CheckBox
            checked={useGrid}
            handleChange={handleChange}
            label={t('application.useGridForMap')}
            name="useGrid"
          />
        ) : (
          <div />
        )}
        {editable ? (
          <ButtonsContainer>
            <Button
              type="button"
              danger
              text="application.cancel"
              click={handleCancel}
              disabled={!hasPendingChanges || isSaving}
            />
            <Button
              type="button"
              text="application.save"
              primary
              click={handleSave}
              disabled={!hasPendingChanges || isSaving}
            />
          </ButtonsContainer>
        ) : null}
      </StyledMapActions>
      <StyledMapOuterContainer>
        <StyledMapContainer
          height={stock.mapHeight}
          width={stock.mapWidth}
          backgroundUrl={mapBackgroundUrl}
        >
          {!admin && !user && (
            <MapGrid height={stock.mapHeight} width={stock.mapWidth} />
          )}
          <MapLayoutContext.Provider value={editable ? mapLayoutContextValue : null}>
            {filteredBoxes.map((box) => (
              <SingleBox
                box={box}
                highlightId={highlightId}
                key={box.id}
                stock={stock}
                admin={admin}
                user={user}
                editable={editable}
                onBoxClick={onBoxClick}
                useGrid={useGrid}
              />
            ))}
          </MapLayoutContext.Provider>
        </StyledMapContainer>
      </StyledMapOuterContainer>
    </div>
  );
};

export { MapView };
