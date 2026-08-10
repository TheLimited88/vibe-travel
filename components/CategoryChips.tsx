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
        paddingBottom: '4px',
        marginBottom: '12px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <button
        onClick={() => onSelectCategory('all')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12.5px',
          fontWeight: 600,
          padding: '8px 16px',
          borderRadius: '999px',
          background: selectedCategory === 'all' ? '#7F53F3' : '#FFFFFF',
          border: `1px solid ${selectedCategory === 'all' ? '#7F53F3' : 'rgba(10, 10, 10, 0.1)'}`,
          color: selectedCategory === 'all' ? '#FFFFFF' : '#0A0A0A',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          transition: 'all 0.2s',
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
              gap: '8px',
              fontSize: '12.5px',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: '999px',
              background: isSelected ? category.color : '#FFFFFF',
              border: `1px solid ${isSelected ? category.color : 'rgba(10, 10, 10, 0.1)'}`,
              color: isSelected ? '#FFFFFF' : '#0A0A0A',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: category.color,
                flexShrink: 0,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                dangerouslySetInnerHTML={{ __html: category.icon }}
              />
            </div>
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
