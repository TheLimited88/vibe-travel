'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type DistanceUnit = 'mi' | 'km';

const STORAGE_KEY = 'vibe_travel_distance_unit';
const MI_TO_KM = 1.60934;

interface DistanceUnitContextValue {
  unit: DistanceUnit;
  setUnit: (unit: DistanceUnit) => void;
  formatDistance: (mi: number) => string;
}

const DistanceUnitContext = createContext<DistanceUnitContextValue | null>(null);

export function DistanceUnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnitState] = useState<DistanceUnit>('mi');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'mi' || stored === 'km') setUnitState(stored);
  }, []);

  const setUnit = (next: DistanceUnit) => {
    setUnitState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const formatDistance = (mi: number): string => {
    return unit === 'mi' ? `${Math.round(mi * 10) / 10} mi` : `${Math.round(mi * MI_TO_KM * 10) / 10} km`;
  };

  return (
    <DistanceUnitContext.Provider value={{ unit, setUnit, formatDistance }}>
      {children}
    </DistanceUnitContext.Provider>
  );
}

export function useDistanceUnit(): DistanceUnitContextValue {
  const ctx = useContext(DistanceUnitContext);
  if (!ctx) throw new Error('useDistanceUnit must be used within DistanceUnitProvider');
  return ctx;
}
