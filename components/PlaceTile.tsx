import Image from 'next/image';
import { Location } from '@/types';

interface PlaceTileProps {
  location: Location;
}

export default function PlaceTile({ location }: PlaceTileProps) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Tile Media */}
      <div
        style={{
          height: '118px',
          position: 'relative',
          background: 'linear-gradient(135deg, #E9E4FB 0%, #F7D9F3 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Image
          src={location.image}
          alt={location.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 50vw, 25vw"
        />

        {/* Category Chip */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            fontSize: '10.5px',
            fontWeight: 700,
            background: 'rgba(255,255,255,0.9)',
            padding: '4px 9px',
            borderRadius: 'var(--radius-pill)',
            zIndex: 10,
          }}
        >
          {location.category}
        </div>

        {/* Distance Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            fontSize: '10.5px',
            fontWeight: 700,
            color: '#fff',
            background: 'rgba(10,10,10,0.55)',
            padding: '4px 9px',
            borderRadius: 'var(--radius-pill)',
            zIndex: 10,
          }}
        >
          {location.distance} mi
        </div>
      </div>

      {/* Tile Body */}
      <div style={{ padding: '10px 12px 12px' }}>
        <p
          style={{
            fontSize: '14px',
            fontWeight: 700,
            margin: '0 0 2px',
            letterSpacing: '-0.01em',
            color: 'var(--color-text-primary)',
          }}
        >
          {location.name}
        </p>
        <p
          style={{
            fontSize: '12px',
            color: 'var(--color-text-tertiary)',
            margin: '0 0 8px',
          }}
        >
          {location.subtitle}
        </p>

        {/* Tile Meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
          }}
        >
          <span>{location.visits} visits</span>
          <span style={{ color: '#C6398C' }}>♥ {location.likes}</span>
        </div>
      </div>
    </div>
  );
}
