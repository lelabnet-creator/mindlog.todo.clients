/**
 * Automatic hand-off to mindlog id from the login page.
 *
 * Someone already signed in to mindlog id should not see our login page at all:
 * the IdP recognises its session, skips its own screen once the client has been
 * approved, and sends them straight back with a code. So the login page goes
 * there by itself — but only once per tab session, and never right after a
 * logout. Otherwise the two cases where the user actually wants this page would
 * be unreachable: coming back from the IdP with the Back button (it would bounce
 * them out again, forever), and signing out (the IdP session would sign them
 * straight back in).
 *
 * sessionStorage, not localStorage: a new tab is a new attempt. Storage can be
 * unavailable (private mode, blocked site data); we then never redirect on our
 * own, which leaves the manual button — the safe side to fail on.
 */
const KEY = 'mindlog.todo.ssoAuto';

export function autoSsoAllowed(): boolean {
  try {
    return sessionStorage.getItem(KEY) !== 'off';
  } catch {
    return false;
  }
}

/** Set before each attempt (no loop) and on logout (no instant re-login). */
export function suppressAutoSso(): void {
  try {
    sessionStorage.setItem(KEY, 'off');
  } catch {
    /* nothing to remember it in: autoSsoAllowed() already says no */
  }
}

/** A session was opened: the next login page of this tab may try again. */
export function resetAutoSso(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* see suppressAutoSso */
  }
}
