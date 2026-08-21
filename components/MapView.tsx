'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { categories } from '@/data/categories';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface PlaceApiRecord {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  address: string;
  lat: number | null;
  lng: number | null;
  heroImage: { url: string } | null;
  status: string;
}

interface MapViewProps {
  onMarkerClick?: (placeSlug: string) => void;
  searchQuery?: string;
}

export default function MapView({ onMarkerClick, searchQuery = '' }: MapViewProps) {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const geolocateControl = useRef<mapboxgl.GeolocateControl | null>(null);
  const markersById = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [hasPreciseLocation, setHasPreciseLocation] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [places, setPlaces] = useState<PlaceApiRecord[] | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceApiRecord | null>(null);
  const [selectedImgError, setSelectedImgError] = useState(false);
  const DEFAULT_CENTER: [number, number] = [-73.9857, 40.7484];
  const userCoords = useRef<[number, number]>(DEFAULT_CENTER);
  const stylesLoaded = useRef(false);
  const isSatellite = useRef(false);
  const filteredPlacesRef = useRef<PlaceApiRecord[]>([]);

  const filteredPlaces = useMemo(() => {
    if (!places) return null;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return places;
    return places.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q)
    );
  }, [places, searchQuery]);

  // Kept in sync during render (not an effect) so it's always current by
  // the time any effect below runs, regardless of effect ordering.
  filteredPlacesRef.current = filteredPlaces || [];

  useEffect(() => {
    fetch('/api/admin/places')
      .then((r) => r.json())
      .then((data) => {
        const published = (data.places || []).filter((p: PlaceApiRecord) => p.status === 'published' && p.lat != null && p.lng != null);
        setPlaces(published);
      })
      .catch(() => setPlaces([]));
  }, []);

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
    if (!mapContainer.current || places === null) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: DEFAULT_CENTER,
      zoom: 12,
      pitch: 0,
      bearing: 0,
    });

    // Re-run on every 'style.load' (fires on initial load AND after every
    // setStyle() call, e.g. toggling satellite/streets) — setStyle swaps
    // the whole style, wiping any sources/layers we'd added, so they need
    // to be re-created each time or the satellite toggle would silently
    // strip out the radius circles, clusters, and markers.
    const setupLayers = () => {
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

      // Create GeoJSON for clustering — uses whatever's currently filtered
      // (ref is kept fresh during render, so this reflects any active
      // search even if this setup only just now ran on first load).
      const placesGeoJSON = {
        type: 'FeatureCollection' as const,
        features: filteredPlacesRef.current.map(place => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [place.lng as number, place.lat as number],
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

      // Show individual HTML markers only for places Mapbox currently
      // reports as NOT clustered at this zoom/pan — the ones absorbed into
      // a numbered cluster circle stay hidden until the cluster breaks
      // apart. Re-synced on every render so it tracks zoom/pan changes.
      const syncUnclusteredMarkers = () => {
        if (!map.current || !map.current.getSource('places')) return;
        if (!map.current.isSourceLoaded('places')) return;

        const unclustered = map.current.querySourceFeatures('places', {
          filter: ['!', ['has', 'point_count']],
        });

        const currentSlugs = new Set<string>();

        unclustered.forEach((feature) => {
          // Mapbox's clustering pipeline serializes complex properties
          // (e.g. stringifies nested objects like heroImage) when features
          // pass through it — so look the real place object up from our
          // own React state by slug instead of trusting feature.properties
          // for anything beyond that one primitive string field.
          const slug = (feature as any).properties?.slug as string | undefined;
          const place = slug ? filteredPlacesRef.current.find((p) => p.slug === slug) : undefined;
          if (!place) return;
          currentSlugs.add(place.slug);
          if (markersById.current.has(place.slug)) return;

          const category = categories.find(c => c.key === place.category) || categories[0];

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

          el.addEventListener('click', (evt) => {
            evt.stopPropagation();
            setSelectedImgError(false);
            setSelectedPlace(place);
            onMarkerClick?.(place.slug);
          });

          const coords = (feature as any).geometry.coordinates as [number, number];
          const marker = new mapboxgl.Marker({ element: el }).setLngLat(coords).addTo(map.current!);
          markersById.current.set(place.slug, marker);
        });

        // Remove markers for places that are now absorbed into a cluster
        markersById.current.forEach((marker, slug) => {
          if (!currentSlugs.has(slug)) {
            marker.remove();
            markersById.current.delete(slug);
          }
        });
      };

      syncUnclusteredMarkers();
      map.current!.on('render', syncUnclusteredMarkers);

      // Add click handler for clusters to zoom in
      map.current!.on('click', 'clusters', (e: any) => {
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

      // Tapping empty map area dismisses the selected-place summary card
      map.current!.on('click', () => setSelectedPlace(null));

      map.current!.getCanvas().style.cursor = ['clusters', 'unclustered-point'].some(layer => {
        return map.current!.getLayer(layer);
      }) ? 'pointer' : '';
    };

    map.current.on('style.load', setupLayers);

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
      isSatellite.current = !isSatellite.current;
      map.current?.setStyle(isSatellite.current ? 'mapbox://styles/mapbox/satellite-v9' : 'mapbox://styles/mapbox/streets-v12');
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
      // A CSS-driven "fullscreen" instead of the native Fullscreen API —
      // the native API makes the element fill the real screen at its
      // natural width, which breaks out of the app's mobile-frame layout
      // and renders as a full desktop-width map. This stays capped at the
      // same 375px mobile width, just expanded to fill the viewport height
      // and sit above the rest of the page.
      setIsFullscreen((f) => !f);
      setTimeout(() => map.current?.resize(), 50);
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

    const onEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
        setTimeout(() => map.current?.resize(), 50);
      }
    };
    document.addEventListener('keydown', onEscKey);

    return () => {
      document.removeEventListener('keydown', onEscKey);
      markersById.current.forEach(marker => marker.remove());
      markersById.current.clear();
      map.current?.remove();
    };
  }, [places, onMarkerClick]);

  // Keep the map's data + view in sync with the live search query, without
  // tearing down and recreating the whole map on every keystroke.
  useEffect(() => {
    if (!map.current || !stylesLoaded.current || !filteredPlaces) return;
    const source = map.current.getSource('places') as mapboxgl.GeoJSONSource | undefined;
    if (!source) return;

    const geojson = {
      type: 'FeatureCollection' as const,
      features: filteredPlaces.map((place) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [place.lng as number, place.lat as number] },
        properties: { ...place },
      })),
    };
    source.setData(geojson as any);

    const q = searchQuery.trim();
    if (!q) return;

    // Debounce the camera move — without this, every keystroke interrupts
    // the previous flyTo/fitBounds mid-flight, which reads as the map
    // constantly zooming out then back in, and never gives Mapbox's tile
    // loading a chance to settle (which was also why the matching marker
    // never actually finished rendering).
    const timer = setTimeout(() => {
      const withCoords = filteredPlaces.filter((p) => p.lat != null && p.lng != null);
      if (withCoords.length === 1) {
        map.current!.flyTo({ center: [withCoords[0].lng as number, withCoords[0].lat as number], zoom: 15, essential: true });
      } else if (withCoords.length > 1) {
        const bounds = new mapboxgl.LngLatBounds();
        withCoords.forEach((p) => bounds.extend([p.lng as number, p.lat as number]));
        map.current!.fitBounds(bounds, { padding: 60, maxZoom: 15 });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filteredPlaces, searchQuery]);

  const selectedCategory = selectedPlace ? categories.find(c => c.key === selectedPlace.category) || categories[0] : null;

  return (
    <div
      style={
        isFullscreen
          ? { position: 'fixed', inset: 0, zIndex: 9999, width: '100%', maxWidth: '375px', height: '100vh', margin: '0 auto', background: '#F9F8F6' }
          : { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }
      }
    >
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

      {selectedPlace && selectedCategory && (
        <div
          style={{
            position: 'absolute',
            left: '12px',
            right: '12px',
            bottom: '12px',
            background: '#fff',
            borderRadius: '18px',
            padding: '14px',
            display: 'flex',
            gap: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.16)',
            zIndex: 20,
          }}
        >
          {selectedPlace.heroImage && !selectedImgError ? (
            <img
              src={selectedPlace.heroImage.url}
              alt={selectedPlace.title}
              onError={() => setSelectedImgError(true)}
              style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: selectedCategory.color, flexShrink: 0 }} />
          )}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0A0A0A' }}>{selectedPlace.title}</div>
              <button
                onClick={() => setSelectedPlace(null)}
                aria-label="Close"
                style={{ flexShrink: 0, width: '28px', height: '28px', borderRadius: '999px', background: 'rgba(10,10,10,0.05)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(10,10,10,0.5)', cursor: 'pointer', fontSize: '14px' }}
              >
                ✕
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: selectedCategory.color }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><g dangerouslySetInnerHTML={{ __html: selectedCategory.icon.replace(/#fff/g, selectedCategory.color) }} /></svg>
              {selectedCategory.label}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedPlace.address}
            </div>
            <button
              onClick={() => router.push(`/place/${selectedPlace.slug}`)}
              style={{
                marginTop: '4px',
                alignSelf: 'flex-start',
                background: '#3EE8A8',
                color: '#0A0A0A',
                border: 'none',
                borderRadius: '999px',
                padding: '7px 16px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              View Place
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
