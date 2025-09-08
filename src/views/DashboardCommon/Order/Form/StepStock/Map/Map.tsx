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
import { setOrderStock } from 'src/actions/order';

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
  const list = useSelector((state: ApplicationState) => state.stock.list);
  const groupsList = useSelector(
    (state: ApplicationState) => state.stockGroup.list,
  );

  const dispatch = useDispatch();

  const { tenant } = useTenant();

  useEffect(() => {
    if (!mapContainerRef.current) return;
    mapboxgl.accessToken =
      'pk.eyJ1IjoibWFyY2luZ3J5Z2llcmVrIiwiYSI6ImNtZXN1NXlmNzA1eHkybHNjdGdvamI2Mm8ifQ.Hz-d0vduFaHw0piD0XBTOQ';

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      // style: 'mapbox://styles/mapbox/light-v11',
      // config: {
      //   basemap: {
      //     theme: 'monochrome',
      //   },
      // },

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
  }, [mapContainerRef]);

  const logoUrl = useMemo(() => {
    if (!tenant) return null;
    if (!tenant.id) return tenant.logo;
    return `${ApiService.url}tenant/logo/${tenant.id}`;
  }, [tenant]);

  const activeStock = useMemo(() => {
    if (!stockId) return null;
    const allStocks = [
      ...list,
      ...groupsList.map((group) => group.stocks).flat(),
    ];
    const fullStock = allStocks.find((stock) => stock.id === stockId);

    if (!fullStock) return null;
    return {
      id: fullStock.id,
      name: fullStock.name,
      address: fullStock.address,
    };
  }, [stockId]);

  const addLocations = () => {
    console.log('LIST', list, groupsList);
    const map = mapRef.current as mapboxgl.Map;

    const allStocks = [
      ...list,
      ...groupsList.map((group) => group.stocks).flat(),
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
          console.log('CLICK', stock);
          dispatch(setOrderStock(stock.id, stock.name, stock.address));
        });
    }
  };
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
