'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { categories } from '@/data/categories';
import { places } from '@/data/places';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MapViewProps {
  onMarkerClick?: (placeSlug: string) => void;
}

export default function MapView({ onMarkerClick }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const geolocateControl = useRef<mapboxgl.GeolocateControl | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [hasPreciseLocation, setHasPreciseLocation] = useState(false);
  const DEFAULT_CENTER: [number, number] = [-73.9857, 40.7484];
  const userCoords = useRef<[number, number]>(DEFAULT_CENTER);
  const stylesLoaded = useRef(false);

  const recenterRadiusCircles = (lng: number, lat: number) => {
    userCoords.current = [lng, lat];
    if (!stylesLoaded.current || !map.current) return;
    const radiusFeatures = buildRadiusFeatures(lng, lat);
    (map.current.getSource('radius-075') as mapboxgl.GeoJSONSource)?.setData(radiusFeatures as any);
    (map.current.getSource('radius-2mi') as mapboxgl.GeoJSONSource)?.setData(radiusFeatures as any);
  };

  const buildRadiusFeatures = (lng: number, lat: number) => ({
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [lng, lat] },
        properties: { radius: 750 },
      },
      {
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [lng, lat] },
        properties: { radius: 3219 },
      },
    ],
  });

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: DEFAULT_CENTER,
      zoom: 12,
      pitch: 0,
      bearing: 0,
    });

    map.current.on('load', () => {
      if (!map.current) return;
      stylesLoaded.current = true;

      // Radius circles (distance indicators), centered on the user's real
      // location once known — falls back to the default center until then.
      const radiusFeatures = buildRadiusFeatures(userCoords.current[0], userCoords.current[1]);

      // Add radius layer for 0.75 mi (purple)
      map.current!.addSource('radius-075', {
        type: 'geojson',
        data: radiusFeatures as any,
      });

      map.current!.addLayer({
        id: 'radius-075-circle',
        type: 'circle',
        source: 'radius-075',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 40, 15, 150],
          'circle-color': '#7F53F3',
          'circle-opacity': 0.1,
        },
      });

      // Add radius layer for 2 mi (green)
      map.current!.addSource('radius-2mi', {
        type: 'geojson',
        data: radiusFeatures as any,
      });

      map.current!.addLayer({
        id: 'radius-2mi-circle',
        type: 'circle',
        source: 'radius-2mi',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 105, 15, 400],
          'circle-color': '#3ca480',
          'circle-opacity': 0.08,
        },
      });

      // Create GeoJSON for clustering
      const placesGeoJSON = {
        type: 'FeatureCollection' as const,
        features: places.map(place => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [place.coordinates.lng, place.coordinates.lat],
          },
          properties: {
            ...place,
          },
        })),
      };

      // Add clustered source
      map.current!.addSource('places', {
        type: 'geojson',
        data: placesGeoJSON as any,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Add clustered circle layer
      map.current!.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'places',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#7F53F3',
          'circle-radius': ['step', ['get', 'point_count'], 30, 10, 40, 20, 50],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
        },
      });

      // Add cluster count text layer
      map.current!.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'places',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-size': 14,
        },
        paint: {
          'text-color': '#FFFFFF',
        },
      });

      // Create HTML markers for individual places
      places.forEach((place) => {
        const category = categories.find(c => c.key === place.category);
        if (!category) return;

        // Create marker element
        const el = document.createElement('div');
        el.style.width = '48px';
        el.style.height = '48px';
        el.style.borderRadius = '50%';
        el.style.background = category.color;
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.cursor = 'pointer';
        el.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="white">${category.icon}</svg>`;

        // Create marker and add to map
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([place.coordinates.lng, place.coordinates.lat])
          .addTo(map.current!);

        // Add click handler
        el.addEventListener('click', () => {
          onMarkerClick?.(place.slug);
        });

        markersRef.current.push(marker);
      });

      // Add click handler for clusters to zoom in
      map.current!.on('click', 'clusters', (e: any) => {
        const features = map.current!.querySourceFeatures('places', {
          filter: ['has', 'point_count'],
        });
        const clusteredSource = map.current!.getSource('places') as mapboxgl.GeoJSONSource;
        const clusterProperties = e.features?.[0]?.properties;
        if (clusterProperties?.cluster_id !== undefined) {
          (clusteredSource as any).getClusterExpansionZoom(clusterProperties.cluster_id, (err: any, zoom: number) => {
            if (err) return;
            map.current!.easeTo({
              center: e.features![0].geometry.coordinates,
              zoom: zoom,
            });
          });
        }
      });

      map.current!.getCanvas().style.cursor = ['clusters', 'unclustered-point'].some(layer => {
        return map.current!.getLayer(layer);
      }) ? 'pointer' : '';
    });

    // Create custom control container
    const controlContainer = document.createElement('div');
    controlContainer.style.position = 'absolute';
    controlContainer.style.bottom = '80px';
    controlContainer.style.right = '12px';
    controlContainer.style.display = 'flex';
    controlContainer.style.flexDirection = 'column';
    controlContainer.style.gap = '12px';
    controlContainer.style.zIndex = '10';

    // Layers control button
    const layersBtn = document.createElement('button');
    layersBtn.style.width = '40px';
    layersBtn.style.height = '40px';
    layersBtn.style.borderRadius = '50%';
    layersBtn.style.background = '#FFFFFF';
    layersBtn.style.border = 'none';
    layersBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    layersBtn.style.cursor = 'pointer';
    layersBtn.style.display = 'flex';
    layersBtn.style.alignItems = 'center';
    layersBtn.style.justifyContent = 'center';
    layersBtn.title = 'Toggle map layers';
    layersBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2L15.5 5.5L9 9L2.5 5.5L9 2Z" stroke="#0A0A0A" stroke-width="1.275" stroke-linejoin="round"/><path d="M9 7L15.5 10.5L9 14L2.5 10.5L9 7Z" stroke="#0A0A0A" stroke-width="1.275" stroke-linejoin="round" fill="#0A0A0A" fill-opacity="0.08"/><path d="M2.5 10.5L9 14L15.5 10.5L9 7L2.5 10.5Z" stroke="#0A0A0A" stroke-width="1.275" stroke-linejoin="round" fill="#0A0A0A" fill-opacity="0.04"/></svg>';
    layersBtn.addEventListener('click', () => {
      const currentStyle = map.current?.getStyle().name;
      const newStyle = currentStyle === 'Streets' ? 'mapbox://styles/mapbox/satellite-v9' : 'mapbox://styles/mapbox/streets-v12';
      map.current?.setStyle(newStyle);
    });

    // Fullscreen control button
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.style.width = '40px';
    fullscreenBtn.style.height = '40px';
    fullscreenBtn.style.borderRadius = '50%';
    fullscreenBtn.style.background = '#FFFFFF';
    fullscreenBtn.style.border = 'none';
    fullscreenBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    fullscreenBtn.style.cursor = 'pointer';
    fullscreenBtn.style.display = 'flex';
    fullscreenBtn.style.alignItems = 'center';
    fullscreenBtn.style.justifyContent = 'center';
    fullscreenBtn.title = 'Toggle fullscreen';
    fullscreenBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" stroke-width="1.8"><path d="M3 7V3h4M21 7V3h-4M3 17v4h4M21 17v4h-4"/></svg>';
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        mapContainer.current?.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen();
      }
    });

    // Geolocate/Compass control button
    const geolocateBtn = document.createElement('button');
    geolocateBtn.style.width = '40px';
    geolocateBtn.style.height = '40px';
    geolocateBtn.style.borderRadius = '50%';
    geolocateBtn.style.background = '#FFFFFF';
    geolocateBtn.style.border = 'none';
    geolocateBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    geolocateBtn.style.cursor = 'pointer';
    geolocateBtn.style.display = 'flex';
    geolocateBtn.style.alignItems = 'center';
    geolocateBtn.style.justifyContent = 'center';
    geolocateBtn.title = 'Show your location';
    geolocateBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="1.8"><circle cx="12" cy="12" r="7" fill="none"/><circle cx="12" cy="12" r="2.5" fill="#2563EB"/><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/></svg>';
    geolocateBtn.addEventListener('click', () => {
      geolocateControl.current?.trigger();
    });

    // Add buttons to container
    controlContainer.appendChild(layersBtn);
    controlContainer.appendChild(fullscreenBtn);
    controlContainer.appendChild(geolocateBtn);

    // Geolocate control — added to the map (required for it to actually
    // function) but its default UI button is hidden since we use our own
    // custom button that calls .trigger() on it instead.
    geolocateControl.current = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
      showAccuracyCircle: true,
    });
    map.current.addControl(geolocateControl.current);
    geolocateControl.current.on('geolocate', (e: any) => {
      setHasPreciseLocation(true);
      recenterRadiusCircles(e.coords.longitude, e.coords.latitude);
    });
    geolocateControl.current.on('error', () => setHasPreciseLocation(false));

    // Auto-trigger it (no prompt appears if permission is already granted;
    // silently does nothing if not) so the user's location shows up without
    // needing to tap the button first.
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((status) => {
        if (status.state === 'granted') {
          geolocateControl.current?.trigger();
        }
      }).catch(() => {});
    }

    // Add custom controls to map container
    const mapCanvas = mapContainer.current?.querySelector('.mapboxgl-canvas-container');
    if (mapCanvas) {
      mapCanvas.parentElement?.appendChild(controlContainer);
    }

    // Hide Mapbox's own geolocate control button (top-left by default) —
    // we drive the same control instance from our own custom button.
    const style = document.createElement('style');
    style.textContent = '.mapboxgl-ctrl-geolocate { display: none !important; } .mapboxgl-ctrl-top-right .mapboxgl-ctrl-group:has(.mapboxgl-ctrl-geolocate) { display: none !important; }';
    mapContainer.current?.appendChild(style);

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [onMarkerClick]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
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
              width: '320px',
              height: '320px',
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
              width: '120px',
              height: '120px',
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
