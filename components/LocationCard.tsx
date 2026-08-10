import { Location } from '@/types';

interface LocationCardProps {
  location: Location;
  layout: 'list' | 'grid';
  showDistance?: boolean;
}

export default function LocationCard({ location, layout, showDistance = false }: LocationCardProps) {
  if (layout === 'list') {
    return (
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
          padding: '12px',
          display: 'flex',
          gap: '12px',
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
            {location.distance} mi away
          </p>
        </div>
      </div>
    );
  }

  // Grid layout
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
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
              {location.visits} visits · <span style={{ color: 'var(--color-accent)' }}>{location.distance} mi</span>
            </>
          ) : (
            `${location.visits} visits`
          )}
        </p>
      </div>
    </div>
  );
}
