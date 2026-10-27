import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import type mapboxglType from 'mapbox-gl'; // import type only

import { setOrderStock } from 'src/actions/order';
import { Skeleton } from 'src/components/ui';
import { useFileStorage } from 'src/hooks/useFileStorage';
import { useTenant } from 'src/hooks/useTenant';
import { currentAppLanguage } from 'src/i18n/app-language';
import { useGetStockGroupsListQuery, useGetStockListQuery } from 'src/queries';
import { ApplicationState } from 'src/reducers';
import { MAPBOX_COUNTRY_NAME_FIELD } from 'src/utils/country-locale';
import { ActiveLocation } from 'src/views/DashboardCommon/Order/Form/StepStock/Map/components/ActiveLocation';

import 'mapbox-gl/dist/mapbox-gl.css';
import 'src/views/DashboardCommon/Order/Form/StepStock/Map/Map.scss';

let mapboxgl: typeof mapboxglType;
async function loadMapbox() {
  mapboxgl = (await import('mapbox-gl')).default;
  // initialize your map here
}

const ExternalContainer = styled('div')(({ theme }) => ({
  width: '100%',
  height: '500px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.spacing * 3,
}));

const MapContainer = styled('div')({
  width: '100%',
  height: '100%',
});

export const Map = () => {
  const mapRef = useRef<unknown>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const stockId = useSelector((state: ApplicationState) => state.order.stockId);
  const { tenant } = useTenant();
  const { data: stocks = null, isPending: stocksLoading } =
    useGetStockListQuery();
  const { data: groups = null, isPending: groupsLoading } =
    useGetStockGroupsListQuery();

  const dispatch = useDispatch();

  const { getAssetPath } = useFileStorage();

  useEffect(() => {
    loadMapbox();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || !mapboxgl) return;
    mapboxgl.accessToken =
      'pk.eyJ1Ijoic21hcnRib3hzdG9yYWdlIiwiYSI6ImNtZ2dkYW01NjA5ankybHM5djFqbjZtNWUifQ.2bn6LvbIw9BeDtAVtsPvrQ';

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [19.1451, 51.9194], // Poland
      zoom: 5,
    });

    mapRef.current = map;

    map.on('load', () => {
      map.setLayoutProperty('country-label', 'text-field', [
        'get',
        MAPBOX_COUNTRY_NAME_FIELD[currentAppLanguage()],
      ]);

      addLocations();
    });

    return () => {
      (mapRef.current as mapboxgl.Map).remove();
    };
  }, [mapContainerRef, stocks, groups]);

  const activeStock = useMemo(() => {
    if (!stockId || !stocks || !groups) return null;
    const allStocks = [
      ...stocks,
      ...groups.map((group) => group.stocks).flat(),
    ];
    const fullStock = allStocks.find((stock) => stock.id === stockId);

    if (!fullStock) return null;
    return {
      id: fullStock.id,
      name: fullStock.name,
      address: fullStock.address,
    };
  }, [stockId, groups, stocks]);

  const addLocations = () => {
    const map = mapRef.current as mapboxgl.Map;

    if (!stocks || !groups) return;

    const allStocks = [
      ...stocks,
      ...groups.map((group) => group.stocks).flat(),
    ];

    for (const stock of allStocks) {
      if (!stock.lat || !stock.lon) continue;

      const el = document.createElement('div');
      el.innerHTML = `<div class="map-marker"><img src=${getAssetPath('logo', tenant?.logo ?? '')} /><span>${stock.name}</span></div>`;

      new mapboxgl.Marker({ element: el })
        .setLngLat([Number(stock.lon), Number(stock.lat)])
        .addTo(map)
        .getElement()
        .addEventListener('click', () => {
          dispatch(setOrderStock(stock.id, stock.name, stock.address));
        });
    }
  };

  if (groupsLoading || stocksLoading)
    return <Skeleton height={500} radius={12} />;

  return (
    <ExternalContainer>
      {activeStock ? (
        <ActiveLocation
          id={activeStock.id}
          address={activeStock.address}
          name={activeStock.name}
        />
      ) : null}
      <MapContainer ref={mapContainerRef}></MapContainer>
    </ExternalContainer>
  );
};
