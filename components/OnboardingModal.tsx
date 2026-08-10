'use client';

import { useState } from 'react';

interface OnboardingModalProps {
  onComplete: () => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [permissions, setPermissions] = useState({
    location: false,
    notifications: false,
    install: false,
  });

  const handleAllow = (key: keyof typeof permissions) => {
    setPermissions({ ...permissions, [key]: true });
  };

  const handleDeny = (key: keyof typeof permissions) => {
    setPermissions({ ...permissions, [key]: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Before you explore</h2>

        {/* Location Permission */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-purple-600 text-xl">
            📍
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">Share your location</h3>
            <p className="text-xs text-gray-500 mt-1">Powers distance sort, the map, and geofence visit detection.</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleDeny('location')}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Deny
              </button>
              <button
                onClick={() => handleAllow('location')}
                className="px-3 py-1 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Allow
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Permission */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-purple-600 text-xl">
            🔔
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">Turn on notifications</h3>
            <p className="text-xs text-gray-500 mt-1">We'll ping you the moment you're getting a promotion or nearby location opening.</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleDeny('notifications')}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Deny
              </button>
              <button
                onClick={() => handleAllow('notifications')}
                className="px-3 py-1 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Allow
              </button>
            </div>
          </div>
        </div>

        {/* Install App Permission */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-purple-600 text-xl">
            📲
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">Install Vibe Travel</h3>
            <p className="text-xs text-gray-500 mt-1">Works like an app — add it to your home screen for one-tap access.</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleDeny('install')}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Deny
              </button>
              <button
                onClick={() => handleAllow('install')}
                className="px-3 py-1 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Install
              </button>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onComplete}
          className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
