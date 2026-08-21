'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface PlaceLocationMapProps {
  lat: number;
  lng: number;
  markerColor?: string;
  markerIcon?: string;
}

export default function PlaceLocationMap({ lat, lng, markerColor = '#7F53F3', markerIcon }: PlaceLocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const geolocateControl = useRef<mapboxgl.GeolocateControl | null>(null);
  const [hasPreciseLocation, setHasPreciseLocation] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: 15,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
    });

    const el = document.createElement('div');
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.borderRadius = '50%';
    el.style.background = markerColor;
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    if (markerIcon) {
      el.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="white">${markerIcon}</svg>`;
    }

    new mapboxgl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map.current);

    const controlContainer = document.createElement('div');
    controlContainer.style.position = 'absolute';
    controlContainer.style.bottom = '10px';
    controlContainer.style.right = '10px';
    controlContainer.style.display = 'flex';
    controlContainer.style.flexDirection = 'column';
    controlContainer.style.gap = '8px';
    controlContainer.style.zIndex = '10';

    const makeControlButton = (title: string, iconHtml: string, onClick: () => void) => {
      const btn = document.createElement('button');
      btn.style.width = '32px';
      btn.style.height = '32px';
      btn.style.borderRadius = '50%';
      btn.style.background = '#FFFFFF';
      btn.style.border = 'none';
      btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
      btn.style.cursor = 'pointer';
      btn.style.display = 'flex';
      btn.style.alignItems = 'center';
      btn.style.justifyContent = 'center';
      btn.title = title;
      btn.innerHTML = iconHtml;
      btn.addEventListener('click', onClick);
      return btn;
    };

    const layersBtn = makeControlButton(
      'Toggle map layers',
      '<svg width="15" height="15" viewBox="0 0 18 18" fill="none"><path d="M9 2L15.5 5.5L9 9L2.5 5.5L9 2Z" stroke="#0A0A0A" stroke-width="1.275" stroke-linejoin="round"/><path d="M9 7L15.5 10.5L9 14L2.5 10.5L9 7Z" stroke="#0A0A0A" stroke-width="1.275" stroke-linejoin="round" fill="#0A0A0A" fill-opacity="0.08"/><path d="M2.5 10.5L9 14L15.5 10.5L9 7L2.5 10.5Z" stroke="#0A0A0A" stroke-width="1.275" stroke-linejoin="round" fill="#0A0A0A" fill-opacity="0.04"/></svg>',
      () => {
        const currentStyle = map.current?.getStyle().name;
        const newStyle = currentStyle === 'Streets' ? 'mapbox://styles/mapbox/satellite-v9' : 'mapbox://styles/mapbox/streets-v12';
        map.current?.setStyle(newStyle);
      }
    );

    const fullscreenBtn = makeControlButton(
      'Toggle fullscreen',
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" stroke-width="1.8"><path d="M3 7V3h4M21 7V3h-4M3 17v4h4M21 17v4h-4"/></svg>',
      () => {
        if (!document.fullscreenElement) {
          mapContainer.current?.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen();
        }
      }
    );

    const geolocateBtn = makeControlButton(
      'Show your location',
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="1.8"><circle cx="12" cy="12" r="7" fill="none"/><circle cx="12" cy="12" r="2.5" fill="#2563EB"/><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/></svg>',
      () => geolocateControl.current?.trigger()
    );

    controlContainer.appendChild(layersBtn);
    controlContainer.appendChild(fullscreenBtn);
    controlContainer.appendChild(geolocateBtn);

    geolocateControl.current = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
      showAccuracyCircle: true,
    });
    map.current.addControl(geolocateControl.current);
    geolocateControl.current.on('geolocate', () => setHasPreciseLocation(true));
    geolocateControl.current.on('error', () => setHasPreciseLocation(false));

    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((status) => {
        if (status.state === 'granted') {
          geolocateControl.current?.trigger();
        }
      }).catch(() => {});
    }

    const mapCanvas = mapContainer.current?.querySelector('.mapboxgl-canvas-container');
    if (mapCanvas) {
      mapCanvas.parentElement?.appendChild(controlContainer);
    }

    const style = document.createElement('style');
    style.textContent = '.mapboxgl-ctrl-geolocate { display: none !important; } .mapboxgl-ctrl-top-right .mapboxgl-ctrl-group:has(.mapboxgl-ctrl-geolocate) { display: none !important; }';
    mapContainer.current?.appendChild(style);

    return () => {
      map.current?.remove();
    };
  }, [lat, lng, markerColor, markerIcon]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
      {!hasPreciseLocation && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '140px',
              height: '140px',
              borderRadius: '999px',
              border: '1.5px dashed rgba(10,155,113,0.4)',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '60px',
              height: '60px',
              borderRadius: '999px',
              background: 'rgba(127,83,243,0.08)',
              border: '1px solid rgba(127,83,243,0.25)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      )}
    </div>
  );
}
