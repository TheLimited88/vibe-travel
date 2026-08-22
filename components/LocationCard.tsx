'use client';

import { useRouter } from 'next/navigation';
import { Location } from '@/types';
import { useDistanceUnit } from '@/components/DistanceUnitProvider';

interface LocationCardProps {
  location: Location;
  layout: 'list' | 'grid' | 'scroll';
  showDistance?: boolean;
  showVisits?: boolean;
  flexGrow?: boolean;
}

export default function LocationCard({ location, layout, showDistance = false, showVisits = false, flexGrow = true }: LocationCardProps) {
  const router = useRouter();
  const { formatDistance } = useDistanceUnit();
  const goToPlace = () => router.push(`/place/${location.id}`);

  if (layout === 'scroll') {
    return (
      <button
        onClick={goToPlace}
        style={{
          width: '140px',
          flexShrink: 0,
          flexGrow: flexGrow ? 1 : 0,
          borderRadius: '16px',
          overflow: 'hidden',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          display: 'block',
          fontFamily: 'inherit',
          textAlign: 'inherit',
          background: 'none',
          border: 'none',
        }}
      >
        {location.image ? (
          <img
            src={location.image}
            alt={location.name}
            style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100px',
              background: 'rgba(127, 127, 127, 0.12)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed rgba(10, 10, 10, 0.2)',
              flexDirection: 'column',
              gap: '2px',
              padding: '8px',
            }}
          >
            <p
              style={{
                fontSize: '10px',
                fontWeight: 500,
                color: 'rgba(10, 10, 10, 0.5)',
                textAlign: 'center',
                margin: 0,
                lineHeight: '1.2',
              }}
            >
              {location.name}
            </p>
            <p
              style={{
                fontSize: '10px',
                fontWeight: 500,
                color: 'rgba(10, 10, 10, 0.4)',
                textAlign: 'center',
                margin: 0,
              }}
            >
              photo
            </p>
          </div>
        )}

        <div style={{ padding: '8px 9px 10px', display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'left' }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#0A0A0A',
              lineHeight: '1.25',
              minHeight: '32.5px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {location.name}
          </div>
          <div style={{ fontSize: '10.5px', color: showDistance ? '#7F53F3' : 'rgba(10, 10, 10, 0.6)', fontWeight: showDistance ? 600 : 400 }}>
            {showDistance && showVisits
              ? `${location.visits} visits${location.distance != null ? ` · ${formatDistance(location.distance)}` : ''}`
              : showDistance
                ? (location.distance != null ? `${formatDistance(location.distance)} away` : 'Enable location for distance')
                : `${location.visits} visits`}
          </div>
        </div>
      </button>
    );
  }

  if (layout === 'list') {
    return (
      <div
        onClick={goToPlace}
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
          padding: '12px',
          display: 'flex',
          gap: '12px',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: '100px',
            height: '100px',
            flexShrink: 0,
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px dashed #000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(127, 127, 127, 0.08)',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: '#000000',
              opacity: 0.75,
              textAlign: 'center',
              padding: '8px',
              lineHeight: '1.4',
            }}
          >
            {location.name} photo
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: '12.2px',
              fontWeight: 700,
              margin: '0 0 8px',
              color: 'var(--color-text-primary)',
            }}
          >
            {location.name}
          </p>
          <p
            style={{
              fontSize: '9.8px',
              color: 'var(--color-accent)',
              fontWeight: 700,
              margin: 0,
            }}
          >
            {location.distance != null ? `${formatDistance(location.distance)} away` : 'Enable location for distance'}
          </p>
        </div>
      </div>
    );
  }

  // Grid layout
  return (
    <div
      onClick={goToPlace}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100px',
          position: 'relative',
          border: '1px dashed #000000',
          background: 'rgba(127, 127, 127, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <p
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#000000',
            opacity: 0.75,
            textAlign: 'center',
            padding: '0 8px',
            lineHeight: '1.4',
            margin: 0,
          }}
        >
          {location.name} photo
        </p>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            fontSize: '11px',
            fontWeight: 400,
            color: '#000000',
            textDecoration: 'underline',
            opacity: 0.6,
            cursor: 'pointer',
          }}
        >
          or browse files
        </a>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <p
          style={{
            fontSize: '12.2px',
            fontWeight: 700,
            margin: '0 0 2px',
            color: 'var(--color-text-primary)',
          }}
        >
          {location.name}
        </p>
        <p
          style={{
            fontSize: '10px',
            color: 'rgba(10, 10, 10, 0.6)',
            margin: 0,
            fontWeight: 400,
          }}
        >
          {showDistance ? (
            <>
              {location.visits} visits
              {location.distance != null && (
                <> · <span style={{ color: 'var(--color-accent)' }}>{formatDistance(location.distance)}</span></>
              )}
            </>
          ) : (
            `${location.visits} visits`
          )}
        </p>
      </div>
    </div>
  );
}
