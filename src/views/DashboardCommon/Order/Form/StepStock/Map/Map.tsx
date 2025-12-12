import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import { ApplicationState } from 'src/reducers';
import { useDispatch, useSelector } from 'react-redux';
import 'mapbox-gl/dist/mapbox-gl.css';
import ApiService from 'src/services/api-service';
import { useTenant } from 'src/hooks/useTenant';
import './Map.scss';
import { ActiveLocation } from './components/ActiveLocation';
import { setOrderFullStock, setOrderStock } from 'src/actions/order';
import {
  StockGroupData,
  StockGroupWithStocks,
  StockList,
} from 'smartbox-types';
import { Skeleton } from 'src/components/ui';

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

  const [stocksLoading, setStocksLoading] = useState<boolean>(true);
  const [groupsLoading, setGroupsLoading] = useState<boolean>(true);
  const [stocks, setStocks] = useState<StockList[] | null>(null);
  const [groups, setGroups] = useState<StockGroupWithStocks[] | null>(null);

  const getStocks = async () => {
    await ApiService.callFetch('GET', `stock/list`, (data: StockList[]) => {
      setStocks(data);
    });
    setStocksLoading(false);
  };

  const getGroups = async () => {
    await ApiService.callFetch(
      'GET',
      `stock-group/list`,
      (data: StockGroupWithStocks[]) => {
        setGroups(data);
      },
    );
    setGroupsLoading(false);
  };

  const dispatch = useDispatch();

  const { tenant } = useTenant();

  useEffect(() => {
    getGroups();
    getStocks();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    mapboxgl.accessToken =
      'pk.eyJ1Ijoic21hcnRib3hzdG9yYWdlIiwiYSI6ImNtZ2dkYW01NjA5ankybHM5djFqbjZtNWUifQ.2bn6LvbIw9BeDtAVtsPvrQ';

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [19.1451, 51.9194], // Poland
      zoom: 5,
    });

    mapRef.current = map;

    map.on('load', () => {
      map.setLayoutProperty('country-label', 'text-field', ['get', 'name_pl']);

      addLocations();
    });

    return () => {
      (mapRef.current as mapboxgl.Map).remove();
    };
  }, [mapContainerRef, stocks, groups]);

  const logoUrl = useMemo(() => {
    if (!tenant) return null;
    if (!tenant.id) return tenant.logo;
    return `${ApiService.url}tenant/logo/${tenant.id}`;
  }, [tenant]);

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

    for (let stock of allStocks) {
      if (!stock.lat || !stock.lon) continue;

      const el = document.createElement('div');
      el.innerHTML = `<div class="map-marker"><img src=${logoUrl} /><span>${stock.name}</span></div>`;

      const marker = new mapboxgl.Marker({ element: el })
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
