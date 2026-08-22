'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export const CITY_OPTIONS = [
  { name: 'New York', country: 'United States' },
  { name: 'Paris', country: 'France' },
];

interface ExploringCityContextValue {
  exploringCity: string | null;
  activeCity: string;
  isRemoteCity: boolean;
  locationLabel: string;
  pickerOpen: boolean;
  openPicker: () => void;
  closePicker: () => void;
  cityQuery: string;
  setCityQuery: (q: string) => void;
  cityOptions: typeof CITY_OPTIONS;
  selectCity: (name: string) => void;
  resetLocation: () => void;
}

const ExploringCityContext = createContext<ExploringCityContextValue | null>(null);

export function ExploringCityProvider({ children }: { children: ReactNode }) {
  const [exploringCity, setExploringCity] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState('');

  const activeCity = exploringCity || 'New York';
  const isRemoteCity = !!exploringCity;
  const locationLabel = isRemoteCity ? activeCity : 'Near me';

  const cityOptions = CITY_OPTIONS.filter(
    (c) => !cityQuery.trim() || c.name.toLowerCase().includes(cityQuery.trim().toLowerCase())
  );

  const value: ExploringCityContextValue = {
    exploringCity,
    activeCity,
    isRemoteCity,
    locationLabel,
    pickerOpen,
    openPicker: () => {
      setCityQuery('');
      setPickerOpen(true);
    },
    closePicker: () => setPickerOpen(false),
    cityQuery,
    setCityQuery,
    cityOptions,
    selectCity: (name: string) => {
      setExploringCity(name === 'New York' ? null : name);
      setPickerOpen(false);
    },
    resetLocation: () => setExploringCity(null),
  };

  return <ExploringCityContext.Provider value={value}>{children}</ExploringCityContext.Provider>;
}

export function useExploringCity(): ExploringCityContextValue {
  const ctx = useContext(ExploringCityContext);
  if (!ctx) throw new Error('useExploringCity must be used within ExploringCityProvider');
  return ctx;
}
