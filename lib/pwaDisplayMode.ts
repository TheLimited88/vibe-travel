// A page running as an installed PWA (added to home screen, opened in its
// own standalone window) is being used deliberately, in the field, as a
// dedicated app — unlike a quick glance in a browser tab, the extra battery
// cost of a real GPS fix (vs. a fast, coarse WiFi/cell-tower estimate) is a
// reasonable tradeoff there. `display-mode: standalone` covers Android/most
// browsers; `navigator.standalone` is Safari's older iOS-specific flag,
// still needed since not every iOS version reports the media query.
export function isInstalledPwa(): boolean {
  if (typeof window === 'undefined') return false;
  const isStandaloneDisplay = window.matchMedia?.('(display-mode: standalone)').matches;
  const isIosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  return !!isStandaloneDisplay || !!isIosStandalone;
}

// Geolocation options tuned by install status: a real GPS-grade fix (with
// more patience for it to arrive) when installed, the lighter/faster
// browser default otherwise.
export function geolocationOptions(): PositionOptions {
  const installed = isInstalledPwa();
  return {
    enableHighAccuracy: installed,
    timeout: installed ? 15000 : 8000,
    maximumAge: 0,
  };
}

// Safari never fires beforeinstallprompt, so the only way onto the home
// screen there is the manual Share -> Add to Home Screen flow.
export function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return true;
  // iPadOS 13+ reports itself as "Macintosh" in Safari by default — the
  // classic touch-points + platform check is the standard way to still
  // catch it.
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}
