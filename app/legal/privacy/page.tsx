'use client';

import { useRouter } from 'next/navigation';
import LegalContentBody from '@/components/LegalContentBody';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#FFFFFF', paddingTop: '20px' }}>
      <div style={{ width: '100%', maxWidth: '335px' }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
          }}
        >
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="44" height="44" rx="22" fill="white"/>
            <rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="#0A0A0A" strokeOpacity="0.08"/>
            <path d="M23.4901 25.4609H22.5077L20.5996 22.6271V22.5327H21.6764L23.4901 25.4609ZM23.4901 19.6611L21.6764 22.5893H20.5996V22.4949L22.5077 19.6611H23.4901Z" fill="black"/>
          </svg>
        </button>

        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 28px', textAlign: 'left', color: '#0A0A0A' }}>
          Privacy Policy
        </h1>

        <LegalContentBody contentKey="privacy" />
      </div>
    </div>
  );
}
