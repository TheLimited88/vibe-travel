// Shared "soft dismiss vs. hard block" tracking for the install-prompt
// nudges (Android's native prompt, iOS's manual walkthrough nudge). A
// site-visit counter (once per browser session, not per page load) lets a
// "Maybe later" dismissal re-surface on a later visit instead of vanishing
// forever — only "Don't show again" is a true permanent block.

const VISIT_COUNT_KEY = 'site_visit_count';
const SESSION_MARKER_KEY = 'site_visit_session_marker';

// Call once per app load. Increments the persistent visit counter the
// first time in a given browser session, not on every internal navigation.
export function recordVisit(): number {
  if (typeof window === 'undefined') return 0;
  const current = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10);
  if (sessionStorage.getItem(SESSION_MARKER_KEY)) return current;
  const next = current + 1;
  localStorage.setItem(VISIT_COUNT_KEY, String(next));
  sessionStorage.setItem(SESSION_MARKER_KEY, '1');
  return next;
}

interface DismissState {
  dismissedAtVisit: number;
}

function getDismissState(key: string): DismissState | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setDismissedNow(key: string, visitCount: number): void {
  localStorage.setItem(key, JSON.stringify({ dismissedAtVisit: visitCount }));
}

// True if this prompt has never been soft-dismissed, or enough visits have
// passed since the last dismissal to show it again (default: 2 more visits,
// so a visit-1 dismissal re-surfaces on visit 3, matching "the 3rd time the
// user accesses the site").
export function isReadyToReshow(key: string, visitCount: number, cooldownVisits = 2): boolean {
  const state = getDismissState(key);
  if (!state) return true;
  return visitCount >= state.dismissedAtVisit + cooldownVisits;
}
