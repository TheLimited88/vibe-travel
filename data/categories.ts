// Canonical category taxonomy from design 32
// Each entry has exact color and SVG icon (24x24 viewBox, white stroke/fill)
// 5 categories wired into home screen filter chips: park, architecture, shopping, nightlife, restaurant

export interface Category {
  key: string;
  label: string;
  color: string;
  icon: string;
}

export const categories: Category[] = [
  { key: 'landmark', label: 'Landmark', color: '#2AA8C4', icon: '<path d="M12 3L8 12M12 3l4 9M8 12L5 21M16 12l3 9M8 12h8M6.5 16.5h11" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 21h16" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>' },
  { key: 'historic_site', label: 'Historic Site', color: '#E0813C', icon: '<path d="M3 10l9-6 9 6M4 20h16M4 10v10M20 10v10" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' },
  { key: 'museum', label: 'Museum', color: '#9C6B3F', icon: '<path d="M3 10l9-6 9 6M5 10v9M9 10v9M15 10v9M19 10v9M4 20h16" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' },
  { key: 'gallery', label: 'Gallery', color: '#1E8FBF', icon: '<rect x="4" y="4" width="16" height="16" rx="1" stroke="#fff" stroke-width="1.6"/><path d="M4 16l4-5 3 3 5-6 4 5" stroke="#fff" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>' },
  { key: 'religious_site', label: 'Religious Site', color: '#D6459A', icon: '<path d="M12 2v20M7 7h10" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>' },
  { key: 'monument', label: 'Monument', color: '#4C9A4C', icon: '<path d="M10 21V9l2-6 2 6v12M9 21h6" stroke="#fff" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>' },
  { key: 'architecture', label: 'Architecture', color: '#D9A62B', icon: '<circle cx="12" cy="6.5" r="1.6" stroke="#fff" stroke-width="1.4"/><path d="M12 8l-5 13M12 8l5 13" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.7 16h2.3M13 16h2.3" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>' },
  { key: 'park', label: 'Park', color: '#3E9B57', icon: '<path d="M12 3l4 6H8l4-6zM12 8l4 6H8l4-6zM12 14v7" stroke="#fff" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>' },
  { key: 'garden', label: 'Garden', color: '#E0526B', icon: '<path d="M5 19C4 10 10 4 19 5c1 9-5 15-14 14z" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>' },
  { key: 'nature_reserve', label: 'Nature Reserve', color: '#3FA688', icon: '<path d="M2 17l5-9 4 5 3-4 8 8H2z" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>' },
  { key: 'beach', label: 'Beach', color: '#B5622E', icon: '<path d="M3 13c2 0 2-3 4-3s2 3 4 3 2-3 4-3 2 3 4 3 2-3 4-3" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' },
  { key: 'mountain', label: 'Mountain', color: '#8A56C9', icon: '<path d="M4 19L12 5l8 14H4z" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>' },
  { key: 'lake', label: 'Lake', color: '#4B8FE3', icon: '<path d="M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>' },
  { key: 'river', label: 'River', color: '#4E7DA8', icon: '<path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 19c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>' },
  { key: 'waterfall', label: 'Waterfall', color: '#1478A6', icon: '<path d="M8 3c0 4-3 4-3 8s3 4 3 8M16 3c0 4-3 4-3 8s3 4 3 8" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><path d="M4 3h16" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>' },
  { key: 'cave', label: 'Cave', color: '#6B5B4A', icon: '<path d="M3 21V14a9 9 0 0118 0v7" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 21h18" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>' },
  { key: 'island', label: 'Island', color: '#14608C', icon: '<path d="M2 19c4-6 16-6 20 0" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><path d="M12 19V9M12 9c0-3 3-4 5-3-1 3-3 4-5 3zM12 11c0-2-2-3-4-2 1 2 2 3 4 2z" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/>' },
  { key: 'trail', label: 'Trail', color: '#C9862F', icon: '<path d="M3 19c3-1 3-5 6-6s3 4 6 3 3-6 6-7" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>' },
  { key: 'wildlife', label: 'Wildlife', color: '#37A0A0', icon: '<circle cx="12" cy="15.5" r="3.2" fill="#fff"/><circle cx="7" cy="9" r="1.7" fill="#fff"/><circle cx="12" cy="6.5" r="1.7" fill="#fff"/><circle cx="17" cy="9" r="1.7" fill="#fff"/>' },
  { key: 'restaurant', label: 'Restaurant', color: '#E0537C', icon: '<path d="M6 2v7a1.6 1.6 0 003.2 0V2M4.5 2v7M7.5 2v7M6 9v13M17 2c-2.5 1-2.5 6 0 8v11" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>' },
  { key: 'cafe', label: 'Café', color: '#5C6470', icon: '<path d="M4 8h13v4a5 5 0 01-5 5H9a5 5 0 01-5-5V8z" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M17 9.5h1.5a2 2 0 010 4H17" stroke="#fff" stroke-width="1.5"/><path d="M8 3.5c0 1-1 1-1 2M12 3.5c0 1-1 1-1 2" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>' },
  { key: 'bar', label: 'Bar', color: '#A85CE0', icon: '<path d="M4 4h16l-8 9-8-9z" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 13v6M8 19h8" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>' },
  { key: 'shopping', label: 'Shopping', color: '#2E7DBF', icon: '<path d="M6 8h12l1 12H5L6 8z" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 8V6a3 3 0 016 0v2" stroke="#fff" stroke-width="1.6"/>' },
  { key: 'market', label: 'Market', color: '#D97B48', icon: '<path d="M4 9l2-5h12l2 5" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 9v10h16V9" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>' },
  { key: 'entertainment', label: 'Entertainment', color: '#5FA6D6', icon: '<circle cx="12" cy="12" r="9" stroke="#fff" stroke-width="1.6"/><path d="M10 8.5l6 3.5-6 3.5v-7z" fill="#fff"/>' },
  { key: 'theatre', label: 'Theatre', color: '#B0473F', icon: '<circle cx="8.5" cy="12" r="5" stroke="#fff" stroke-width="1.4"/><circle cx="16" cy="12" r="5" stroke="#fff" stroke-width="1.4"/><circle cx="7" cy="10.2" r="0.7" fill="#fff"/><circle cx="10.5" cy="10.2" r="0.7" fill="#fff"/><path d="M6.3 14q2.2 2 4.4 0" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/><circle cx="14.3" cy="10.2" r="0.7" fill="#fff"/><circle cx="17.8" cy="10.2" r="0.7" fill="#fff"/><path d="M13.6 14.8q2.2 -2 4.4 0" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>' },
  { key: 'sports_venue', label: 'Sports Venue', color: '#3F9E7A', icon: '<path d="M7 3h10v4a5 5 0 01-10 0V3z" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 5H4.5a2 2 0 000 4H6M17 5h2.5a2 2 0 010 4H18" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/><path d="M12 12v5M9 20h6M9.5 17h5v3h-5z" stroke="#fff" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>' },
  { key: 'ancient_ruins', label: 'Ancient Ruins', color: '#A68A5B', icon: '<path d="M7 21V9M17 21V9M6 9h12M6 6h12l-1-3H7L6 6z" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 13h2M13 15h2M9 17h2" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>' },
  { key: 'unesco_world_heritage', label: 'UNESCO World Heritage', color: '#2C6E8F', icon: '<circle cx="12" cy="12" r="9" stroke="#fff" stroke-width="1.5"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" stroke="#fff" stroke-width="1.3"/>' },
  { key: 'art_and_culture', label: 'Art & Culture', color: '#A6459E', icon: '<path d="M12 3a9 8 0 100 16c1.5 0 1.5-1.5 0-2s-1-2 .5-2H16a4 4 0 004-4c0-4.5-4-8-8-8z" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/><circle cx="8" cy="10" r="1" fill="#fff"/><circle cx="12" cy="8" r="1" fill="#fff"/><circle cx="16" cy="10" r="1" fill="#fff"/>' },
  { key: 'street_art', label: 'Street Art', color: '#E0428F', icon: '<circle cx="7" cy="8" r="2.2" fill="#fff"/><circle cx="14" cy="6" r="1.6" fill="#fff"/><circle cx="17" cy="12" r="1.8" fill="#fff"/><path d="M4 20c3-4 6-6 9-6s6 3 7 6" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>' },
  { key: 'film_location', label: 'Film Location', color: '#4A4E69', icon: '<path d="M3 9h18v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/><path d="M3 9l2-5h3l-2 5M9 9l2-5h3l-2 5M15 9l2-5h3l-2 5" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/>' },
  { key: 'nightlife', label: 'Nightlife', color: '#3E3B6B', icon: '<path d="M16 3a8 8 0 100 18 9 9 0 01-9-9c0-4 3-8 9-9z" stroke="#fff" stroke-width="1.4" stroke-linejoin="round" fill="#fff" fill-opacity="0.12"/><path d="M20 8l.6 1.4L22 10l-1.4.6L20 12l-.6-1.4L18 10l1.4-.6L20 8z" fill="#fff"/>' },
];

export const homeScreenChips = ['landmark', 'historic_site', 'ancient_ruins', 'museum', 'architecture'];
