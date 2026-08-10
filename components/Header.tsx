const imgVibeTravel = "https://www.figma.com/api/mcp/asset/1f68b835-50df-46db-9a5c-cbedf58de9f6.png";
const imgMapIcon = "https://www.figma.com/api/mcp/asset/dfe3dee6-4513-482d-9fab-a5c5754c79e4.svg";
const imgAccountIcon = "https://www.figma.com/api/mcp/asset/9ac3fa6d-5060-46a0-99f0-c58858fbb192.svg";

export default function Header() {
  return (
    <header
      style={{
        padding: '12px 18px',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div
          style={{
            height: '28px',
            aspectRatio: '150.95/28',
            backgroundImage: `url('${imgVibeTravel}')`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left center',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'white',
              border: '1px solid rgba(10, 10, 10, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              padding: '0',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: '#0A0A0A' }}
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
          <button
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#7F53F3',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              padding: '0',
            }}
          >
            <img
              src={imgAccountIcon}
              alt="Account"
              style={{
                width: '17px',
                height: '17px',
                display: 'block',
              }}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
