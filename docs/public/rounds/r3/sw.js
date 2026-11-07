// Service worker: display pushes and route a tap to the right canvas + window.
//
// Lives in public/ so Vite copies it into dist/ verbatim and never bundles it —
// a hashed filename would break the fixed "/sw.js" registration, and a module
// graph would pull app code into a worker that must boot with no dependencies.
//
// This file is a FALLBACK, not the main path. On Safari 18.4+ the push is
// declarative: the OS reads the `notification` object out of the payload, shows
// the banner itself, and performs `navigate` on tap — none of the handlers below
// run at all. They exist for iOS 16.4–18.3 and for every non-Safari browser.
//
// Deliberately does NOT cache anything. The app is a live terminal plus a canvas
// that saves over HTTP; serving either from a stale cache would be actively
// harmful, and offline is meaningless when the whole point is reaching a daemon
// on another machine.

const FALLBACK_TITLE = "CanvasAgents";

self.addEventListener("install", () => {
  // Take over immediately rather than waiting for every tab to close. A pushed
  // notification that lands on the OLD worker would use the old payload shape.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    // A payload we cannot parse must STILL produce a notification — see the
    // waitUntil note below. Silence is what gets the subscription revoked.
  }

  // Declarative payloads nest everything under `notification`; accept both shapes
  // so one payload serves the OS path and this one (the Worker builds both).
  const n = data.notification ?? data;
  const title = n.title || FALLBACK_TITLE;
  const body = n.body || "";
  const url = n.navigate || "/";
  const badge = typeof n.app_badge === "number" ? n.app_badge : undefined;

  // event.waitUntil is MANDATORY, and awaiting inside an async handler is not a
  // substitute: the event can be terminated before the promise settles, the
  // notification never shows, and roughly three of those in a row make iOS revoke
  // the subscription outright. This is the single most fragile line in the file.
  event.waitUntil(
    (async () => {
      await self.registration.showNotification(title, {
        body,
        // Read back by notificationclick below — the event gives us no payload.
        data: { url },
        // Coalesces per canvas+window, so five events while the user is away
        // replace one banner instead of stacking five.
        tag: n.tag,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
      });
      // Home Screen icon badge. Best-effort: not implemented everywhere, and
      // failing must not stop the notification above from having been shown.
      if (badge !== undefined && self.navigator.setAppBadge) {
        try {
          await self.navigator.setAppBadge(badge);
        } catch {
          /* unsupported — the banner is what matters */
        }
      }
    })(),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";
  event.waitUntil(focusOrOpen(url));
});

/**
 * Bring an existing window to the front and point it at `url`, or open one.
 *
 * `includeUncontrolled: true` matters: a page loaded before this worker activated
 * is not controlled by it, and without the flag it is invisible here — so the tap
 * would open a SECOND window onto the same canvas, which means a second browser
 * socket on the same pty and every keystroke delivered twice.
 */
async function focusOrOpen(url) {
  const absolute = new URL(url, self.location.origin).href;
  const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  for (const client of clients) {
    try {
      await client.focus();
      // Not all browsers implement navigate(); focus alone still lands the user
      // in the app, where the badge tells them which canvas to open.
      if (client.navigate) await client.navigate(absolute);
      return;
    } catch {
      /* try the next one */
    }
  }
  await self.clients.openWindow(absolute);
}
