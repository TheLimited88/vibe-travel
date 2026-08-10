interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.002)',
        border: '1px solid rgba(10, 10, 10, 0.08)',
        borderRadius: '14px',
        padding: '11px 16px',
        marginBottom: '12px',
        fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <span style={{ fontSize: '15px' }}>🔍</span>
      <input
        type="text"
        placeholder="Find interesting"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          border: 'none',
          background: 'transparent',
          outline: 'none',
          fontSize: '13px',
          color: 'rgba(10, 10, 10, 0.6)',
          fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      />
    </div>
  );
}
