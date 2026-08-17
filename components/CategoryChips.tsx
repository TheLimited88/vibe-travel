'use client';

import { categories, homeScreenChips } from '@/data/categories';

interface CategoryChipsProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategoryChips({ selectedCategory, onSelectCategory }: CategoryChipsProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '12px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <button
        onClick={() => onSelectCategory('all')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '11px',
          fontWeight: 600,
          padding: '5px 12px',
          borderRadius: '999px',
          background: selectedCategory === 'all' ? '#7F53F3' : '#FFFFFF',
          border: `1px solid ${selectedCategory === 'all' ? '#7F53F3' : 'rgba(10, 10, 10, 0.1)'}`,
          color: selectedCategory === 'all' ? '#FFFFFF' : '#0A0A0A',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          transition: 'all 0.2s',
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        All
      </button>

      {homeScreenChips.map((categoryKey) => {
        const category = categories.find((c) => c.key === categoryKey);
        if (!category) return null;

        const isSelected = selectedCategory === category.key;

        return (
          <button
            key={category.key}
            onClick={() => onSelectCategory(category.key)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 600,
              padding: '5px 12px',
              borderRadius: '999px',
              background: isSelected ? category.color : '#FFFFFF',
              border: `1px solid ${isSelected ? category.color : 'rgba(10, 10, 10, 0.1)'}`,
              color: isSelected ? '#FFFFFF' : '#0A0A0A',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0,
              lineHeight: 1,
            }}
          >
            <span
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '999px',
                background: category.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 24 24"
                fill="none"
              >
                {category.icon.split('<path').slice(1).map((pathStr, i) => {
                  const match = pathStr.match(/d="([^"]+)"/);
                  const stroke = pathStr.match(/stroke="([^"]+)"/)?.[1];
                  const fill = pathStr.match(/fill="([^"]+)"/)?.[1];
                  if (match) {
                    return (
                      <path
                        key={i}
                        d={match[1]}
                        stroke={stroke || '#fff'}
                        fill={fill || 'none'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    );
                  }
                  return null;
                })}
              </svg>
            </span>
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
