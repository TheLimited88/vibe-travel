type View = 'tile' | 'map';

interface ViewToggleProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '6px',
        padding: '4px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-pill)',
        width: 'fit-content',
        margin: '12px 0 4px 0',
      }}
    >
      <button
        onClick={() => onViewChange('tile')}
        style={{
          fontSize: '12.5px',
          fontWeight: 700,
          padding: '7px 16px',
          borderRadius: 'var(--radius-pill)',
          color: currentView === 'tile' ? '#fff' : 'var(--color-text-secondary)',
          background: currentView === 'tile' ? 'var(--color-text-primary)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        Tile View
      </button>
      <button
        onClick={() => onViewChange('map')}
        style={{
          fontSize: '12.5px',
          fontWeight: 700,
          padding: '7px 16px',
          borderRadius: 'var(--radius-pill)',
          color: currentView === 'map' ? '#fff' : 'var(--color-text-secondary)',
          background: currentView === 'map' ? 'var(--color-text-primary)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        Map View
      </button>
    </div>
  );
}
