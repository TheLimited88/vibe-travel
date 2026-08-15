'use client';

import React, { useState } from 'react';
import { places } from '@/data/places';
import { categories } from '@/data/categories';
import MapView from '@/components/MapView';
import { useImageUpload } from '@/hooks/useImageUpload';

const categoryColors: { [key: string]: string } = {
  beach: '#F97316',
  landmark: '#2E7FE8',
  historic_site: '#8B4513',
  museum: '#6B3FD1',
  gallery: '#EC4899',
  religious_site: '#6366F1',
  monument: '#64748B',
  architecture: '#0891B2',
  park: '#16A34A',
  garden: '#84CC16',
  nature_reserve: '#059669',
  mountain: '#78716C',
  lake: '#0369A1',
  river: '#0EA5E9',
  waterfall: '#06B6D4',
  cave: '#5B21B6',
  island: '#10B981',
  trail: '#92400E',
  wildlife: '#D97706',
  restaurant: '#DC2626',
  cafe: '#F59E0B',
  bar: '#A16207',
  shopping: '#E11D48',
  market: '#BE185D',
  entertainment: '#9F1239',
  theatre: '#6B21A8',
  sports_venue: '#1E40AF',
  ancient_ruins: '#92400E',
  unesco_world_heritage: '#7C3AED',
  art_and_culture: '#EF4444',
  street_art: '#FB923C',
  film_location: '#F43F5E',
  nightlife: '#4C1D95',
  photography_location: '#14B8A6',
};

const categoryLabels: { [key: string]: string } = {
  beach: 'Beach',
  landmark: 'Landmark',
  historic_site: 'Historic Site',
  museum: 'Museum',
  gallery: 'Gallery',
  religious_site: 'Religious Site',
  monument: 'Monument',
  architecture: 'Architecture',
  park: 'Park',
  garden: 'Garden',
  nature_reserve: 'Nature Reserve',
  mountain: 'Mountain',
  lake: 'Lake',
  river: 'River',
  waterfall: 'Waterfall',
  cave: 'Cave',
  island: 'Island',
  trail: 'Trail',
  wildlife: 'Wildlife',
  restaurant: 'Restaurant',
  cafe: 'Café',
  bar: 'Bar',
  shopping: 'Shopping',
  market: 'Market',
  entertainment: 'Entertainment',
  theatre: 'Theatre',
  sports_venue: 'Sports Venue',
  ancient_ruins: 'Ancient Ruins',
  unesco_world_heritage: 'UNESCO World Heritage',
  art_and_culture: 'Art & Culture',
  street_art: 'Street Art',
  film_location: 'Film Location',
  nightlife: 'Nightlife',
  photography_location: 'Photography Location',
};

const categoryIcons: { [key: string]: JSX.Element } = {
  landmark: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L6 8h3v10h6V8h3L12 2z" fill="currentColor"/></svg>,
  historic_site: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="6" width="16" height="14" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5"/><line x1="12" y1="6" x2="12" y2="20" stroke="currentColor" strokeWidth="1"/><rect x="8" y="10" width="2" height="3" fill="currentColor"/><rect x="14" y="10" width="2" height="3" fill="currentColor"/></svg>,
  museum: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 8L12 4l8 4v11H4V8z" stroke="currentColor" strokeWidth="1.5" fill="none"/><line x1="8" y1="8" x2="8" y2="19" stroke="currentColor" strokeWidth="1"/><line x1="16" y1="8" x2="16" y2="19" stroke="currentColor" strokeWidth="1"/></svg>,
  gallery: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="8" cy="9" r="1.5" fill="currentColor"/><path d="M3 18l5-5 4 4 8-8" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>,
  religious_site: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L14 7L19 7L15 11L17 16L12 12L7 16L9 11L5 7L10 7L12 2Z" fill="currentColor"/></svg>,
  monument: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L14 6H10L12 2Z" fill="currentColor"/><rect x="7" y="6" width="10" height="12" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>,
  architecture: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="14" stroke="currentColor" strokeWidth="1.5" fill="none"/><line x1="9" y1="6" x2="9" y2="20" stroke="currentColor" strokeWidth="1"/><line x1="15" y1="6" x2="15" y2="20" stroke="currentColor" strokeWidth="1"/><rect x="5" y="8" width="2" height="2" fill="currentColor"/><rect x="11" y="8" width="2" height="2" fill="currentColor"/><rect x="17" y="8" width="2" height="2" fill="currentColor"/></svg>,
  park: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="7" r="2" fill="currentColor"/><circle cx="12" cy="4" r="2.5" fill="currentColor"/><circle cx="18" cy="8" r="2" fill="currentColor"/><path d="M6 9v9M12 6.5v11.5M18 10v8" stroke="currentColor" strokeWidth="1.5"/></svg>,
  garden: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3C12 3 9 8 9 11C9 13.2 10.3 15 12 15C13.7 15 15 13.2 15 11C15 8 12 3 12 3Z" fill="currentColor"/><path d="M6 10C6 10 4 14 4 16C4 17.7 5.1 19 6.5 19C7.9 19 9 17.7 9 16C9 14 6 10 6 10Z" fill="currentColor" opacity="0.6"/><path d="M18 10C18 10 16 14 16 16C16 17.7 17.1 19 18.5 19C19.9 19 21 17.7 21 16C21 14 18 10 18 10Z" fill="currentColor" opacity="0.6"/></svg>,
  nature_reserve: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M8 15C8 10 10 8 12 8C14 8 16 10 16 15" fill="currentColor"/><path d="M12 15C12 10 14 8 16 8C18 8 20 10 20 15" fill="currentColor" opacity="0.7"/><line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="1.5"/></svg>,
  beach: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 16C6 14 8 13 10 13C12 13 14 14 16 16C18 14 20 13 22 13" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/><line x1="3" y1="19" x2="21" y2="19" stroke="currentColor" strokeWidth="2"/></svg>,
  mountain: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M2 18L8 10L12 15L18 7L22 18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/><circle cx="19" cy="7" r="1.2" fill="currentColor"/></svg>,
  lake: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M2 14C4 12 6 11 8 11C10 11 12 12 14 14C16 12 18 11 20 11C22 11 23 12 24 14" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M2 18C4 16 6 15 8 15C10 15 12 16 14 18C16 16 18 15 20 15C22 15 23 16 24 18" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>,
  river: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M8 2C6 4 5 6 5 8C5 10 6 12 8 14C10 12 11 10 11 8C11 6 10 4 8 2Z" fill="currentColor"/><path d="M16 4C14 6 13 8 13 10C13 12 14 14 16 16C18 14 19 12 19 10C19 8 18 6 16 4Z" fill="currentColor" opacity="0.7"/></svg>,
  waterfall: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2V10" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="11" r="1.2" fill="currentColor"/><path d="M12 13V21" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="8" r="0.8" fill="currentColor"/><circle cx="16" cy="8" r="0.8" fill="currentColor"/><circle cx="8" cy="16" r="0.8" fill="currentColor"/><circle cx="16" cy="16" r="0.8" fill="currentColor"/></svg>,
  cave: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 14C4 12 3 9 3 6C3 4 5 2 8 2H16C19 2 21 4 21 6C21 9 20 12 19 14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M8 14V20M16 14V20" stroke="currentColor" strokeWidth="1.2"/></svg>,
  island: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="2.5" fill="currentColor"/><path d="M12 10.5V16M8 14C8 14 6 13 6 11C6 9 8 7 10 7" stroke="currentColor" strokeWidth="1.3" fill="none"/><path d="M16 14C16 14 18 13 18 11C18 9 16 7 14 7" stroke="currentColor" strokeWidth="1.3" fill="none"/><ellipse cx="12" cy="17" rx="7" ry="2" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>,
  trail: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 18C6 15 8 12 10 9C12 6 14 4 16 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 16C8 13 10 10 11 8" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.6"/><circle cx="9" cy="3" r="1" fill="currentColor"/></svg>,
  wildlife: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="20" cy="6" r="1.5" fill="currentColor"/><path d="M8 10C6 10 5 12 5 14C5 16 6 17 8 17" fill="currentColor"/><path d="M16 10C18 10 19 12 19 14C19 16 18 17 16 17" fill="currentColor"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/></svg>,
  restaurant: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 8H21L19 18H5L3 8Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="5" r="1.2" fill="currentColor"/><circle cx="16" cy="5" r="1.2" fill="currentColor"/></svg>,
  cafe: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M14.5 9H19V14C19 15.1 18.1 16 17 16H13" stroke="currentColor" strokeWidth="1.5" fill="none"/><line x1="8" y1="16" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5"/><circle cx="7" cy="12" r="1" fill="currentColor"/><circle cx="17" cy="12" r="1" fill="currentColor"/></svg>,
  bar: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 4V14H7V4H6ZM11 2V14H12V2H11ZM16 5V14H17V5H16Z" fill="currentColor"/><line x1="4" y1="15" x2="20" y2="15" stroke="currentColor" strokeWidth="1.5"/></svg>,
  shopping: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6H21L18 16H6L3 6Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.2"/><path d="M7 6V4C7 3 8 2 9 2C10 2 11 3 11 4V6M13 6V4C13 3 14 2 15 2C16 2 17 3 17 4V6" stroke="currentColor" strokeWidth="1.2"/></svg>,
  market: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 9H21L19 17H5L3 9Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.2"/><rect x="6" y="4" width="12" height="5" stroke="currentColor" strokeWidth="1.3" fill="none"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/></svg>,
  entertainment: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="12" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M10 10L15 13L10 16V10Z" fill="currentColor"/></svg>,
  theatre: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="7" cy="10" r="2" fill="currentColor"/><circle cx="17" cy="10" r="2" fill="currentColor"/><path d="M9 10C9 10 10 8 12 8C14 8 15 10 15 10" stroke="currentColor" strokeWidth="1.2" fill="none"/><rect x="4" y="13" width="16" height="8" stroke="currentColor" strokeWidth="1.3" fill="none"/></svg>,
  sports_venue: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4L14 8L18 9L15 12L16 16L12 14L8 16L9 12L6 9L10 8L12 4Z" fill="currentColor"/><circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/></svg>,
  ancient_ruins: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="3" height="8" stroke="currentColor" strokeWidth="1.3" fill="none"/><rect x="9" y="8" width="3" height="10" stroke="currentColor" strokeWidth="1.3" fill="none"/><rect x="14" y="10" width="3" height="8" stroke="currentColor" strokeWidth="1.3" fill="none"/><line x1="3" y1="19" x2="21" y2="19" stroke="currentColor" strokeWidth="1.5"/><circle cx="5.5" cy="7" r="1" fill="currentColor"/><circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="16" cy="7" r="1" fill="currentColor"/></svg>,
  unesco_world_heritage: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"/><circle cx="12" cy="12" r="2" fill="currentColor"/><line x1="12" y1="3" x2="12" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.6"/><line x1="12" y1="16" x2="12" y2="21" stroke="currentColor" strokeWidth="1" opacity="0.6"/></svg>,
  art_and_culture: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="2.5" fill="currentColor" opacity="0.8"/><circle cx="12" cy="14" r="3" fill="currentColor" opacity="0.6"/><circle cx="15" cy="8" r="2" fill="currentColor" opacity="0.7"/><path d="M8 20C9 18 10 17 12 17C14 17 15 18 16 20" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>,
  street_art: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="7" cy="10" r="2.5" fill="currentColor"/><circle cx="17" cy="10" r="2.5" fill="currentColor"/><path d="M6 16C6 14 7 13 12 13C17 13 18 14 18 16" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M9 17L10 20L12 19L14 20L15 17" stroke="currentColor" strokeWidth="1" fill="none"/></svg>,
  film_location: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="12" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="6" cy="11" r="1.5" fill="currentColor"/><circle cx="12" cy="11" r="1.5" fill="currentColor"/><circle cx="18" cy="11" r="1.5" fill="currentColor"/></svg>,
  nightlife: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3C12 3 7 7 7 12C7 16 9 18 12 18C15 18 17 16 17 12C17 7 12 3 12 3Z" fill="currentColor" opacity="0.8"/><circle cx="12" cy="14" r="2" fill="rgba(255,255,255,0.6)"/></svg>,
  photography_location: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.2" fill="none"/><circle cx="17" cy="8" r="1.5" fill="currentColor"/></svg>,
};

export default function AdminPlacesPage() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPlaceSlug, setEditingPlaceSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: '',
    vibes: [] as string[],
    address: '',
    about: '',
    youtube: '',
    status: 'draft' as 'draft' | 'published',
    heroImageUrl: '',
    heroImageUrls: { thumbnail: '', mobile: '', desktop: '' },
    gallery: [] as string[],
    locationMode: 'address' as 'address' | 'gps',
    latitude: '',
    longitude: '',
    creatorName: 'Brett Williams',
    creatorPhoto: '',
  });
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([
    'Flatbush Ave & Aviation Rd, Brooklyn, NY',
    'Flatbush Ave & Aviation Rd, Brooklyn, NY, New York, NY, USA',
    'Flatbush Ave & Aviation Rd, Brooklyn, NY St, Brooklyn, NY, USA',
    'Flatbush Ave & Aviation Rd, Brooklyn, NY Ave, Queens, NY, USA',
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [previewSheetExpanded, setPreviewSheetExpanded] = useState(false);

  const { uploadImage, uploadProgress } = useImageUpload();

  const handleImageUpload = async (file: File | null, imageType: string) => {
    if (!file) return;
    const placeId = formData.title.toLowerCase().replace(/\s+/g, '-') || 'place';
    const uploadedUrls = await uploadImage(file, placeId, imageType);

    if (uploadedUrls) {
      if (imageType === 'hero') {
        setFormData({
          ...formData,
          heroImageUrl: uploadedUrls.mobile,
          heroImageUrls: uploadedUrls,
        });
      }
    }
  };

  const filteredPlaces = places.filter(p => {
    const statusMatch = filterStatus === 'all' || p.status === filterStatus;
    const searchMatch = searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: '375px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Status Bar */}
        <div style={{ height: '44px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: '12px', fontWeight: '600', borderBottom: '1px solid rgba(0,0,0,0.05)', flexShrink: 0 }}>
          <span>9:41</span>
          <span>●●●●●●●●●</span>
        </div>

        {/* Header */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.05)', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0A0A0A' }}>Places</div>
            <button style={{ background: '#3EE8A8', color: '#0A0A0A', border: 'none', borderRadius: '999px', padding: '9px 16px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}>+ New Place</button>
          </div>

          {/* Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '14px', padding: '10px 14px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="rgba(10,10,10,0.5)" strokeWidth="2" /><path d="M21 21l-4.3-4.3" stroke="rgba(10,10,10,0.5)" strokeWidth="2" strokeLinecap="round" /></svg>
            <input type="text" placeholder="Search Places" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px', background: 'transparent', fontFamily: 'inherit' }} />
          </div>

          {/* View Toggle */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => setViewMode('list')} style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '999px', padding: '6px 12px', fontSize: '12px', fontWeight: '600', border: `1px solid ${viewMode === 'list' ? '#6B3FD1' : 'rgba(10,10,10,0.1)'}`, background: viewMode === 'list' ? '#6B3FD1' : '#fff', color: viewMode === 'list' ? '#fff' : '#0A0A0A', cursor: 'pointer' }}>☰ List</button>
            <button onClick={() => setViewMode('map')} style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '999px', padding: '6px 12px', fontSize: '12px', fontWeight: '600', border: `1px solid ${viewMode === 'map' ? '#6B3FD1' : 'rgba(10,10,10,0.1)'}`, background: viewMode === 'map' ? '#6B3FD1' : '#fff', color: viewMode === 'map' ? '#fff' : '#0A0A0A', cursor: 'pointer' }}>⬥ Map</button>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['all', 'draft', 'published', 'archived'] as const).map((status) => {
              const isActive = filterStatus === status;
              const isDraft = status === 'draft';
              const isPublished = status === 'published';
              const isArchived = status === 'archived';
              if (isDraft) {
                return (
                  <button key={status} onClick={() => setFilterStatus(status)} style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '999px', padding: '6px 12px', fontSize: '12px', fontWeight: '600', border: `1px solid ${isActive ? '#ED8A2C' : 'rgba(10,10,10,0.1)'}`, background: '#fff', color: '#ED8A2C', cursor: 'pointer', textTransform: 'capitalize' }}>
                    Draft
                  </button>
                );
              }
              if (isPublished) {
                return (
                  <button key={status} onClick={() => setFilterStatus(status)} style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '999px', padding: '6px 12px', fontSize: '12px', fontWeight: '600', border: `1px solid rgba(10,10,10,0.1)`, background: '#fff', color: '#0A0A0A', cursor: 'pointer', textTransform: 'capitalize' }}>
                    Published
                  </button>
                );
              }
              if (isArchived) {
                return (
                  <button key={status} onClick={() => setFilterStatus(status)} style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '999px', padding: '6px 12px', fontSize: '12px', fontWeight: '600', border: `1.5px solid #C23B3B`, background: '#fff', color: '#C23B3B', cursor: 'pointer', textTransform: 'capitalize' }}>
                    Archived
                  </button>
                );
              }
              return (
                <button key={status} onClick={() => setFilterStatus(status)} style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '999px', padding: '6px 12px', fontSize: '12px', fontWeight: '600', border: `1px solid ${isActive ? 'rgba(10,10,10,0.1)' : 'rgba(10,10,10,0.1)'}`, background: '#fff', color: '#0A0A0A', cursor: 'pointer', textTransform: 'capitalize' }}>
                  All
                </button>
              );
            })}
          </div>
        </div>

        {/* Map View */}
        {viewMode === 'map' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: '380px', position: 'relative', overflow: 'hidden' }}>
              <MapView onMarkerClick={(slug) => console.log('Clicked:', slug)} />
            </div>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', fontSize: '11px', color: 'rgba(10,10,10,0.6)', padding: '16px', background: '#fff' }}>
              <span>● Published</span>
              <span>◌ Draft</span>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredPlaces.map((place) => {
              const category = categories.find(c => c.key === place.category);
              return (
                <div key={place.slug} style={{ background: '#fff', border: '1px solid rgba(10,10,10,0.06)', borderRadius: '14px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '10px', background: 'rgba(10,10,10,0.05)', border: '1px dashed rgba(10,10,10,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', flexShrink: 0 }}>
                      <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.4)', textAlign: 'center', lineHeight: '1.3' }}>Photo<br/>or<br/>browse<br/>files</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#0A0A0A' }}>{place.title}</div>
                      {category && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px', marginBottom: '4px', fontSize: '11px', fontWeight: '600', color: category.color }}>
                          <div style={{ width: '16px', height: '16px', borderRadius: '999px', background: category.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" dangerouslySetInnerHTML={{ __html: category.icon }} />
                          </div>
                          {category.label}
                        </div>
                      )}
                      {place.tags && place.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '4px', fontSize: '10px', color: 'rgba(10,10,10,0.5)', fontWeight: '500' }}>
                          {place.tags.map((tag, idx) => (
                            <span key={idx}>{tag}</span>
                          ))}
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)', marginTop: '4px', marginBottom: '6px' }}>{place.subtitle}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'rgba(10,10,10,0.5)' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="#2E7FE8" strokeWidth="2"/><circle cx="12" cy="9.5" r="2.3" stroke="#2E7FE8" strokeWidth="2"/></svg>
                        {place.address}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontSize: '10.5px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px', background: place.status === 'published' ? 'rgba(10,155,113,0.12)' : place.status === 'draft' ? 'rgba(237,138,44,0.12)' : place.status === 'archived' ? 'rgba(10,10,10,0.08)' : 'rgba(10,10,10,0.07)', color: place.status === 'published' ? '#0A9B71' : place.status === 'draft' ? '#ED8A2C' : place.status === 'archived' ? 'rgba(10,10,10,0.4)' : 'rgba(10,10,10,0.5)' }}>
                      {place.status.charAt(0).toUpperCase() + place.status.slice(1)}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => {
                        setEditingPlaceSlug(place.slug);
                        setFormData(prev => ({
                          ...prev,
                          title: place.title,
                          subtitle: place.subtitle,
                          category: place.category,
                          vibes: place.tags || [],
                          address: place.address,
                          about: place.about,
                          youtube: '',
                          status: place.status as 'draft' | 'published',
                        }));
                      }} style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(10,10,10,0.05)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l11-11-4-4L4 16v4z" stroke="#0A0A0A" strokeWidth="1.7" strokeLinejoin="round"/><path d="M14 6l4 4" stroke="#0A0A0A" strokeWidth="1.7"/></svg>
                      </button>
                      <button style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(220,50,50,0.08)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" stroke="#C23B3B" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Edit Modal */}
        {true && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '44px' }}>
            <div style={{ width: '100%', maxWidth: '375px', height: 'calc(100vh - 44px)', background: '#fff', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              {/* Modal Header */}
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(10,10,10,0.08)', flexShrink: 0, gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <button onClick={() => setEditingPlaceSlug(null)} style={{ width: '44px', height: '44px', borderRadius: '999px', background: '#fff', border: '1px solid rgba(10,10,10,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                    ‹
                  </button>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#0A0A0A' }}>Edit Place</div>
                </div>
                <button onClick={() => setShowPreview(!showPreview)} style={{ background: showPreview ? '#6B3FD1' : 'rgba(10,10,10,0.06)', border: 'none', borderRadius: '999px', padding: '8px 14px', fontSize: '12.5px', fontWeight: '700', color: showPreview ? '#fff' : '#0A0A0A', cursor: 'pointer', flexShrink: 0 }}>◎ Preview</button>
              </div>

              {/* Form or Preview Content */}
              {!showPreview ? (
              <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Title */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Title</label>
                  <input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    maxLength={80}
                    style={{ border: '1px solid rgba(10,10,10,0.1)', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A' }}
                  />
                  <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.45)', alignSelf: 'flex-end' }}>{(formData.title || '').length}/80</span>
                </div>

                {/* SEO URL */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>SEO URL (generated from title)</span>
                  <span style={{ fontSize: '12.5px', color: '#6B3FD1', fontFamily: 'monospace' }}>vibetravel.app/places/{formData.title.toLowerCase().replace(/\s+/g, '-')}</span>
                </div>

                {/* Subtitle */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Subtitle</label>
                  <input
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    maxLength={120}
                    style={{ border: '1px solid rgba(10,10,10,0.1)', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A' }}
                  />
                  <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.45)', alignSelf: 'flex-end' }}>{(formData.subtitle || '').length}/120</span>
                </div>

                {/* Category */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Category</span>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ border: '1px solid rgba(10,10,10,0.12)', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A', background: '#fff' }}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.key} value={cat.key}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Vibes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Vibe <span style={{ fontWeight: '500', color: 'rgba(10,10,10,0.4)' }}>(up to 2)</span></span>
                  {(formData.vibes || []).length < 2 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value && !formData.vibes.includes(e.target.value)) {
                          setFormData({ ...formData, vibes: [...formData.vibes, e.target.value] });
                          e.target.value = '';
                        }
                      }}
                      style={{ border: '1px solid rgba(10,10,10,0.12)', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A', background: '#fff' }}
                    >
                      <option value="">Add a vibe tag...</option>
                      {['Hidden Gem', 'Quirky', 'Great Views', 'Photo Worthy', 'Sunset', 'Wildlife', 'Peaceful', 'Offbeat', 'Instagrammable', 'Family-Friendly'].filter(vibe => !formData.vibes.includes(vibe)).map((vibe) => (
                        <option key={vibe} value={vibe}>{vibe}</option>
                      ))}
                    </select>
                  )}
                  {(formData.vibes || []).length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {formData.vibes.map((vibe, idx) => (
                        <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(127,83,243,0.1)', color: '#6B3FD1', borderRadius: '999px', padding: '5px 6px 5px 12px', fontSize: '12.5px', fontWeight: '600' }}>
                          {vibe}
                          <button onClick={() => setFormData({ ...formData, vibes: formData.vibes.filter((_, i) => i !== idx) })} style={{ width: '16px', height: '16px', borderRadius: '999px', border: 'none', background: 'rgba(127,83,243,0.2)', color: '#6B3FD1', fontSize: '11px', cursor: 'pointer' }}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location - Address/GPS Toggle */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Location</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setFormData({ ...formData, locationMode: 'address' })}
                      style={{ background: formData.locationMode === 'address' ? '#6B3FD1' : '#fff', color: formData.locationMode === 'address' ? '#fff' : '#0A0A0A', border: `1px solid ${formData.locationMode === 'address' ? '#6B3FD1' : 'rgba(10,10,10,0.1)'}`, borderRadius: '10px', padding: '6px 12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Address
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, locationMode: 'gps' })}
                      style={{ background: formData.locationMode === 'gps' ? '#6B3FD1' : '#fff', color: formData.locationMode === 'gps' ? '#fff' : '#0A0A0A', border: `1px solid ${formData.locationMode === 'gps' ? '#6B3FD1' : 'rgba(10,10,10,0.1)'}`, borderRadius: '10px', padding: '6px 12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      GPS Coordinates
                    </button>
                  </div>

                  {formData.locationMode === 'address' ? (
                    <div style={{ position: 'relative' }}>
                      <input
                        value={formData.address}
                        onChange={(e) => {
                          setFormData({ ...formData, address: e.target.value });
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Search address…"
                        style={{ border: '1px solid rgba(10,10,10,0.1)', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A', width: '100%' }}
                      />
                      {showSuggestions && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid rgba(10,10,10,0.1)', borderTop: 'none', borderRadius: '0 0 10px 10px', zIndex: 10 }}>
                          {addressSuggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setFormData({ ...formData, address: suggestion });
                                setShowSuggestions(false);
                              }}
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 12px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', borderBottom: idx < addressSuggestions.length - 1 ? '1px solid rgba(10,10,10,0.05)' : 'none' }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="#2E7FE8" strokeWidth="1.5"/><circle cx="12" cy="9.5" r="2" stroke="#2E7FE8" strokeWidth="1.5"/></svg>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                                <div style={{ fontSize: '12px', fontWeight: '500', color: '#0A0A0A' }}>{suggestion.split(',')[0]}</div>
                                <div style={{ fontSize: '10px', color: 'rgba(10,10,10,0.6)' }}>{suggestion.split(',').slice(1).join(',').trim()}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        placeholder="Latitude"
                        style={{ flex: 1, border: '1px solid rgba(10,10,10,0.1)', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A' }}
                      />
                      <input
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        placeholder="Longitude"
                        style={{ flex: 1, border: '1px solid rgba(10,10,10,0.1)', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A' }}
                      />
                    </div>
                  )}
                </div>

                {/* About */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: '#fff', border: '1px solid rgba(10,10,10,0.1)', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(10,10,10,0.45)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>About</span>
                    <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.6)' }}>{(formData.about || '').length}/500</span>
                  </div>
                  <textarea
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value.substring(0, 500) })}
                    rows={4}
                    style={{ border: '1px solid rgba(10,10,10,0.1)', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A', resize: 'none' }}
                  />
                </div>

                {/* Creator Profile */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Creator Profile</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E8D5F2', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#6B3FD1' }}>{formData.creatorName}</span>
                    </div>
                  </div>
                </div>

                {/* Hero Image */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Hero (square tile format, 1:1, 1080 x 1080 px)</label>
                    <button style={{ width: '16px', height: '16px', borderRadius: '999px', background: 'rgba(10,10,10,0.1)', border: 'none', color: 'rgba(10,10,10,0.6)', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>i</button>
                  </div>
                  <label style={{ width: '120px', height: '120px', borderRadius: '12px', background: '#f0f0f0', border: '2px dashed rgba(10,10,10,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(10,10,10,0.6)', fontSize: '12px', textAlign: 'center', fontWeight: '500', opacity: uploadProgress.isUploading ? 0.6 : 1 }}>
                    {uploadProgress.isUploading ? '📤 Uploading...' : formData.heroImageUrl ? '✓ Image added' : '+ Upload'}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0] || null, 'hero')} disabled={uploadProgress.isUploading} style={{ display: 'none' }} />
                  </label>
                  {uploadProgress.error && (
                    <div style={{ padding: '8px 12px', background: 'rgba(197, 56, 85, 0.1)', borderRadius: '8px', fontSize: '11px', color: '#C53855' }}>
                      ❌ {uploadProgress.error}
                    </div>
                  )}
                  {uploadProgress.success && (
                    <div style={{ padding: '8px 12px', background: 'rgba(10, 155, 113, 0.1)', borderRadius: '8px', fontSize: '11px', color: '#0A9B71' }}>
                      ✅ Compressed & uploaded! 90% size reduction
                    </div>
                  )}
                </div>

                {/* Gallery */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Gallery — photo or video, up to 6. Drag ⠿ to reorder</label>
                    <button style={{ width: '16px', height: '16px', borderRadius: '999px', background: 'rgba(10,10,10,0.1)', border: 'none', color: 'rgba(10,10,10,0.6)', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>i</button>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {[...Array(Math.max(3, (formData.gallery || []).length))].map((_, i) => (
                      <label key={i} style={{ position: 'relative', flexShrink: 0, width: '88px', height: '156px', borderRadius: '10px', background: '#f0f0f0', border: '2px dashed rgba(10,10,10,0.2)', cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(10,10,10,0.6)', fontSize: '11px' }}>
                        {i < (formData.gallery || []).length ? '✓ Added' : '+ Add'}
                        <input type="file" accept="image/*,video/*" onChange={(e) => {
                          if (e.target.files?.[0] && (formData.gallery || []).length < 6) {
                            setFormData({ ...formData, gallery: [...formData.gallery, e.target.files[0]] });
                          }
                        }} style={{ display: 'none' }} />
                      </label>
                    ))}
                    {(formData.gallery || []).length < 6 && (
                      <div style={{ position: 'relative', flexShrink: 0, width: '88px', height: '156px', borderRadius: '10px', background: '#f0f0f0', border: '2px dashed rgba(10,10,10,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(10,10,10,0.6)', fontSize: '11px' }}>
                        + {6 - (formData.gallery || []).length} more
                      </div>
                    )}
                  </div>
                </div>

                {/* YouTube URL */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>YouTube URL (optional)</label>
                  <input
                    value={formData.youtube}
                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    style={{ border: '1px solid rgba(10,10,10,0.1)', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A' }}
                  />
                </div>

                {/* Video Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Video links (Reels/TikToks/clips of this place on other platforms)</span>
                  <button style={{ textAlign: 'left', background: 'none', border: 'none', color: '#6B3FD1', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', padding: 0 }}>+ Add video link</button>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setFormData({ ...formData, status: 'draft' })} style={{ flex: 1, background: formData.status === 'draft' ? '#fff' : 'rgba(10,10,10,0.05)', border: `1px solid ${formData.status === 'draft' ? 'rgba(10,10,10,0.1)' : 'rgba(10,10,10,0.08)'}`, borderRadius: '12px', padding: '8px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Save Draft</button>
                  <button onClick={() => setFormData({ ...formData, status: 'published' })} style={{ flex: 1, background: 'linear-gradient(135deg, #95048B, #6B3FD1)', color: '#fff', border: 'none', borderRadius: '12px', padding: '8px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Publish</button>
                </div>
                <button style={{ background: '#3EE8A8', color: '#0A0A0A', border: 'none', borderRadius: '12px', padding: '8px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Save Changes</button>

                {/* Danger Zone */}
                <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid rgba(10,10,10,0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', textTransform: 'uppercase' }}>Danger Zone</span>
                  <button style={{ background: '#fff', border: '1px solid rgba(10,10,10,0.12)', borderRadius: '12px', padding: '11px', fontSize: '13px', fontWeight: '600', color: '#0A0A0A', cursor: 'pointer' }}>Delete Place (soft)</button>
                  <button onClick={() => setShowDeleteConfirm(true)} style={{ background: 'transparent', border: 'none', padding: '8px', fontSize: '12px', color: 'rgba(10,10,10,0.6)', cursor: 'pointer' }}>Permanently delete…</button>
                </div>
              </div>
              ) : (
                <div style={{ position: 'relative', height: 'calc(100vh - 44px)', background: '#000', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {/* Media Gallery */}
                  <div style={{ position: 'relative', flex: 1, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {/* Gradient Overlay */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '130px', background: 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0))', pointerEvents: 'none' }} />

                    {/* Progress Bars */}
                    <div style={{ position: 'absolute', top: '60px', left: '14px', right: '14px', display: 'flex', gap: '5px', zIndex: 30 }}>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div key={i} style={{ flex: 1, height: '2px', background: 'rgba(255,255,255,0.4)', borderRadius: '1px' }} />
                      ))}
                    </div>

                    {/* Back Button */}
                    <button style={{ position: 'absolute', top: '74px', left: '14px', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0,0,0,0.35)', border: 'none', color: '#fff', cursor: 'pointer', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
                        <path d="M7.5 1.5l-6 6 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {/* Fullscreen Button */}
                    <button style={{ position: 'absolute', top: '74px', right: '56px', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0,0,0,0.35)', border: 'none', color: '#fff', cursor: 'pointer', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M8 3H4a1 1 0 00-1 1v4M16 3h4a1 1 0 011 1v4M8 21H4a1 1 0 01-1-1v-4M16 21h4a1 1 0 001-1v-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>

                    {/* Share Button */}
                    <button style={{ position: 'absolute', top: '74px', right: '14px', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0,0,0,0.35)', border: 'none', color: '#fff', cursor: 'pointer', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="2.6" stroke="#fff" strokeWidth="1.6"/><circle cx="6" cy="12" r="2.6" stroke="#fff" strokeWidth="1.6"/><circle cx="18" cy="19" r="2.6" stroke="#fff" strokeWidth="1.6"/><path d="M8.3 10.7l7.4-4.2M8.3 13.3l7.4 4.2" stroke="#fff" strokeWidth="1.6"/></svg>
                    </button>

                    {/* Distance Badge */}
                    <div style={{ position: 'absolute', top: '118px', left: '14px', display: 'flex', alignItems: 'center', gap: '5px', background: 'linear-gradient(135deg,#95048B,#6B3FD1)', borderRadius: '999px', padding: '6px 12px', zIndex: 1, boxShadow: '0 3px 10px rgba(127,83,243,0.4)' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="#fff" strokeWidth="1.8"/><circle cx="12" cy="9.5" r="2.3" stroke="#fff" strokeWidth="1.8"/></svg>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>0.6 mi</span>
                    </div>

                    {/* Hero Image or Placeholder */}
                    {formData.heroImageUrl ? (
                      <img src={formData.heroImageUrl} alt="Hero preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Media Gallery</div>
                    )}
                  </div>

                  {/* Bottom Sheet Card */}
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff', borderRadius: '24px 24px 0 0', zIndex: 10, boxShadow: '0 -8px 30px rgba(0,0,0,0.18)', height: previewSheetExpanded ? '90vh' : '420px', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'height 0.3s ease' }}>
                    {/* Chevron Button */}
                    <button onClick={() => setPreviewSheetExpanded(!previewSheetExpanded)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '10px 0 4px', flexShrink: 0, width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ transform: previewSheetExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}><path d="M6 9l6 6 6-6" stroke="rgba(10,10,10,0.45)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>

                    {/* Scrollable Content */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {/* Title & Category */}
                      <div>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0A0A0A', margin: '0 0 8px 0' }}>{formData.title || 'Place Title'}</h3>
                        {formData.category && (
                          (() => {
                            const catColor = categoryColors[formData.category] || '#6B3FD1';
                            const catLabel = categoryLabels[formData.category] || formData.category;
                            const catIcon = categoryIcons[formData.category];
                            return (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `${catColor}15`, color: catColor, padding: '3px 10px 3px 4px', borderRadius: '999px', fontSize: '11px', fontWeight: '700' }}>
                                {catIcon && <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: catColor }}>{catIcon}</span>}
                                {catLabel}
                              </div>
                            );
                          })()
                        )}
                      </div>

                      {/* Vibes */}
                      {formData.vibes && formData.vibes.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {formData.vibes.map((vibe, i) => (
                            <span key={i} style={{ fontSize: '11px', color: '#0A9B71', fontWeight: '600', background: 'rgba(10,155,113,0.1)', borderRadius: '999px', padding: '3px 10px' }}>{vibe}</span>
                          ))}
                        </div>
                      )}

                      {/* Subtitle */}
                      {formData.subtitle && (
                        <p style={{ fontSize: '13.5px', color: 'rgba(10,10,10,0.6)', margin: 0, lineHeight: '1.4' }}>{formData.subtitle}</p>
                      )}

                      {/* Address & Date */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {formData.address && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', color: 'rgba(10,10,10,0.5)' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="#2E7FE8" strokeWidth="2"/><circle cx="12" cy="9.5" r="2.3" stroke="#2E7FE8" strokeWidth="2"/></svg>
                            {formData.address}
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(10,10,10,0.5)' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke="rgba(10,10,10,0.5)" strokeWidth="1.8"/><path d="M3 9h18M8 2v4M16 2v4" stroke="rgba(10,10,10,0.5)" strokeWidth="1.8" strokeLinecap="round"/></svg>
                          Added 12 February 2026
                        </div>
                      </div>

                      {/* Stats Boxes */}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: 'rgba(62,232,168,0.1)', color: '#3EE8A8', borderRadius: '14px', padding: '9px 6px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="currentColor" strokeWidth="1.8"/><path d="M9 9.5l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <span style={{ fontSize: '14px', fontWeight: '800', lineHeight: 1 }}>1893</span>
                          <span style={{ fontSize: '9.5px', fontWeight: '600', letterSpacing: '0.3px', textTransform: 'uppercase', opacity: 0.75 }}>Visited</span>
                        </div>
                        <button style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: 'linear-gradient(135deg, #95048B, #6B3FD1)', color: '#fff', border: 'none', borderRadius: '14px', padding: '9px 6px', cursor: 'pointer' }}>
                          <span style={{ fontSize: '16px', lineHeight: 1 }}>★</span>
                          <span style={{ fontSize: '14px', fontWeight: '800', lineHeight: 1 }}>301</span>
                          <span style={{ fontSize: '9.5px', fontWeight: '600', letterSpacing: '0.3px', textTransform: 'uppercase', opacity: 0.85 }}>Saved</span>
                        </button>
                        <button style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: 'linear-gradient(135deg, rgba(149,4,139,0.1), rgba(127,83,243,0.1))', border: '1px solid rgba(149,4,139,0.25)', borderRadius: '14px', padding: '9px 6px', color: '#95048B', cursor: 'pointer' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 22V11M2 13v7a2 2 0 002 2h12.5a2 2 0 002-1.6l1.5-7A2 2 0 0018 11h-5V6a2.5 2.5 0 00-5 0v1.5L5 11H4a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>
                          <span style={{ fontSize: '14px', fontWeight: '800', lineHeight: 1 }}>100%</span>
                          <span style={{ fontSize: '9.5px', fontWeight: '600', letterSpacing: '0.3px', textTransform: 'uppercase', opacity: 0.85 }}>Worth it</span>
                        </button>
                      </div>

                      {/* Open in Maps Button */}
                      <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#3EE8A8', color: '#0A0A0A', border: 'none', borderRadius: '14px', padding: '13px', fontSize: '14.5px', fontWeight: '700', cursor: 'pointer' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L4.5 20l7.5-4 7.5 4L12 2z" fill="#0A0A0A"/></svg>
                        Open in Maps
                      </button>

                      {previewSheetExpanded && (
                        <>
                          {/* About Section */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A' }}>About</div>
                            <div style={{ fontSize: '14px', color: 'rgba(10,10,10,0.75)', lineHeight: '1.55' }}>{formData.about || 'No description provided'}</div>
                          </div>

                          {/* Location Section */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A' }}>Location</div>
                            <div style={{ position: 'relative', height: '130px', borderRadius: '14px', overflow: 'hidden', background: 'repeating-linear-gradient(0deg, rgba(10,10,10,0.035) 0 1px, transparent 1px 26px),repeating-linear-gradient(90deg, rgba(10,10,10,0.035) 0 1px, transparent 1px 26px), #eef0ea' }}>
                              <div style={{ position: 'absolute', left: '50%', top: '50%', width: '26px', height: '26px', borderRadius: '999px 999px 999px 0', background: '#6B3FD1', transform: 'translate(-50%,-100%) rotate(-45deg)', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }}></div>
                              <button style={{ position: 'absolute', bottom: '8px', right: '8px', background: '#fff', border: 'none', borderRadius: '999px', padding: '6px 12px', fontSize: '11px', fontWeight: '700', color: '#6B3FD1', boxShadow: '0 2px 6px rgba(0,0,0,0.12)', cursor: 'pointer' }}>Open in Maps</button>
                            </div>
                          </div>

                          {/* Place Created By Section */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(10,10,10,0.07)', paddingTop: '14px' }}>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A' }}>Place created by</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              {formData.creatorPhoto ? (
                                <img src={formData.creatorPhoto} alt="Creator" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                              ) : (
                                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #C4B5FD, #93C5FD)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '18px' }}>B</div>
                              )}
                              <span style={{ fontSize: '14px', fontWeight: '600', color: '#0A0A0A' }}>{formData.creatorName || 'Brett Williams'}</span>
                            </div>
                          </div>

                          {/* Reviews Section */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid rgba(10,10,10,0.07)', paddingTop: '14px' }}>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A' }}>Reviews · 👍 Worth the trip · 100% (4)</div>

                            {/* Vibe Section */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0A0A0A' }}>Vibe</div>
                              {formData.vibes && formData.vibes.length > 0 ? (
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                  {formData.vibes.map((vibe, i) => (
                                    <span key={i} style={{ fontSize: '12px', fontWeight: '600', background: '#F5D5E9', color: '#A10EBC', borderRadius: '999px', padding: '6px 12px' }}>{vibe}</span>
                                  ))}
                                </div>
                              ) : (
                                <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.5)' }}>No vibes added</div>
                              )}
                            </div>

                            {/* Rate This Place */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Rate this Place</span>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#fff', border: '1px solid rgba(10,10,10,0.15)', borderRadius: '14px', padding: '11px', fontSize: '13px', fontWeight: '700', color: '#0A0A0A', cursor: 'pointer' }}>👍 Worth the trip</button>
                                <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#fff', border: '1px solid rgba(10,10,10,0.15)', borderRadius: '14px', padding: '11px', fontSize: '13px', fontWeight: '700', color: '#0A0A0A', cursor: 'pointer' }}>👎 Not worth it</button>
                              </div>
                            </div>

                            {/* Rate the Vibe */}
                            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: 'calc(50% - 5px)', background: '#fff', border: '1px solid rgba(10,10,10,0.15)', borderRadius: '14px', padding: '11px', fontSize: '13px', fontWeight: '700', color: '#0A0A0A', cursor: 'pointer', margin: '0 auto' }}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="4" y="13" width="3.5" height="8" rx="1.5" fill="#A10EBC" transform="rotate(-12 5.75 17)"/><rect x="10.2" y="8" width="3.5" height="13" rx="1.5" fill="#A10EBC" transform="rotate(-12 12 14.5)"/><rect x="16.4" y="10.5" width="3.5" height="10.5" rx="1.5" fill="#A10EBC" transform="rotate(-12 18.15 15.75)"/></svg>
                              Rate the Vibe
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#0A0A0A' }}>Are you sure?</div>
              <p style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)', margin: 0, lineHeight: '1.5' }}>This action cannot be undone. The place will be permanently deleted.</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, background: '#fff', border: '1px solid rgba(10,10,10,0.1)', borderRadius: '12px', padding: '10px', fontSize: '14px', fontWeight: '600', color: '#0A0A0A', cursor: 'pointer' }}>No</button>
                <button onClick={() => { setShowDeleteConfirm(false); alert('Place permanently deleted'); }} style={{ flex: 1, background: '#C23B3B', border: 'none', borderRadius: '12px', padding: '10px', fontSize: '14px', fontWeight: '600', color: '#fff', cursor: 'pointer' }}>Yes, Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Bottom Navigation */}
        <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(10,10,10,0.07)', display: 'flex', padding: '8px 6px 24px', flexShrink: 0, gap: 0, justifyContent: 'space-around', zIndex: 30 }}>
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: '#6B3FD1', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="currentColor" strokeWidth="1.8"/>
              <circle cx="12" cy="9.5" r="2.6" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
            <span>Places</span>
          </button>
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path d="M4 20h4l11-11-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
            <span>Content</span>
          </button>
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="8" r="3.3" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M2.5 20c1.2-3.6 3.8-5.4 6.5-5.4s5.3 1.8 6.5 5.4" stroke="currentColor" strokeWidth="1.8"/>
              <circle cx="17.5" cy="8.5" r="2.6" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M15.5 14.6c2.2.3 4 1.8 5 4.9" stroke="currentColor" strokeWidth="1.6"/>
            </svg>
            <span>Users</span>
          </button>
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
            <span>Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
