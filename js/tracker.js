/**
 * ANTIGRAVITY REAL-TIME TELEMETRY TRACKER
 * Domain: gautambhuwan.com.np
 * Author: Bhuwan Gautam (Vhuwon Mathers / sudovu)
 * Lightweight (zero-dependency) client-side visitor beacon
 */

(function () {
  'use strict';

  // Prevent multiple executions per page
  if (window.__antigravity_tracker_initialized) return;
  window.__antigravity_tracker_initialized = true;

  // Session Identifier
  const SESSION_KEY = 'ag_session_id';
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  // Device & OS Detection
  function getDeviceType() {
    const ua = navigator.userAgent || '';
    if (/Android/i.test(ua)) return 'Mobile (Android)';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'Mobile (iOS)';
    if (/Macintosh|Mac OS X/i.test(ua)) return 'Desktop (macOS)';
    if (/Windows NT/i.test(ua)) return 'Desktop (Windows)';
    if (/Linux/i.test(ua)) return 'Desktop (Linux)';
    return 'Desktop / Unknown';
  }

  // Browser Detection
  function getBrowserName() {
    const ua = navigator.userAgent || '';
    if (/Edg\//i.test(ua)) return 'Edge';
    if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) return 'Chrome';
    if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) return 'Safari';
    if (/Firefox\//i.test(ua)) return 'Firefox';
    return 'Browser';
  }

  // Geo-IP Resolver (Cached in sessionStorage to stay fast & avoid rate limits)
  async function resolveGeoIP() {
    const cached = sessionStorage.getItem('ag_geoip_cache');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch('https://ipwho.is/', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success !== false) {
          const geo = {
            ip: data.ip || 'Unknown IP',
            city: data.city ? `${data.city}, ${data.country_code || 'NP'}` : (data.country || 'Nepal'),
            asn: data.connection && data.connection.isp ? data.connection.isp : 'Internet Access',
            country: data.country || 'Nepal'
          };
          sessionStorage.setItem('ag_geoip_cache', JSON.stringify(geo));
          return geo;
        }
      }
    } catch (err) {
      // Fallback: estimate from user timezone
    }

    const tz = (Intl && Intl.DateTimeFormat) ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Asia/Kathmandu';
    const fallbackGeo = {
      ip: 'Client Direct',
      city: tz.includes('Kathmandu') ? 'Kathmandu, NP' : (tz.split('/')[1] || 'Nepal'),
      asn: 'Direct Ingress',
      country: 'Nepal'
    };
    return fallbackGeo;
  }

  // Broadcast to Real-Time Cloud Stream (ntfy.sh global SSE stream)
  const CLOUD_STREAM_URL = 'https://ntfy.sh/gautambhuwan_soc_telemetry_stream';

  async function emitTelemetry(action = 'ping') {
    const geo = await resolveGeoIP();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const pingId = sessionId + '_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    
    const payload = {
      action: action, // 'ping', 'heartbeat', or 'leave'
      pingId: pingId,
      sessionId: sessionId,
      time: timeStr,
      timestamp: Date.now(),
      ip: geo.ip,
      city: geo.city,
      asn: geo.asn,
      country: geo.country,
      path: window.location.pathname || '/',
      referrer: document.referrer ? new URL(document.referrer, window.location.href).hostname : 'Direct',
      device: getDeviceType(),
      browser: getBrowserName(),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height
    };

    // 1. Same-device instant broadcast across tabs
    try {
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel('antigravity_telemetry');
        bc.postMessage(payload);
      }
      localStorage.setItem('ag_latest_visitor_ping', JSON.stringify(payload));
    } catch (e) {}

    // 2. Global Cloud Real-Time Pub/Sub (Cross-device, phone-to-desktop, anywhere in the world)
    try {
      fetch(CLOUD_STREAM_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Title': action === 'leave' ? 'Visitor Left' : 'Live Visitor Ingress',
          'Tags': action === 'leave' ? 'door' : 'satellite'
        },
        keepalive: true
      }).catch(() => {});
    } catch (e) {}

    // 3. Optional Firebase Realtime Database Integration (if configured)
    if (window.FIREBASE_DATABASE_URL) {
      try {
        const rtdbUrl = `${window.FIREBASE_DATABASE_URL.replace(/\/$/, '')}/telemetry/active_sessions/${sessionId}.json`;
        if (action === 'leave') {
          fetch(rtdbUrl, { method: 'DELETE', keepalive: true }).catch(() => {});
        } else {
          fetch(rtdbUrl, { method: 'PUT', body: JSON.stringify(payload) }).catch(() => {});
        }
      } catch (e) {}
    }
  }

  // Initial page-load ping
  emitTelemetry('ping');

  // Heartbeat every 25 seconds while tab is active to maintain live status
  const heartbeatTimer = setInterval(() => {
    if (!document.hidden) {
      emitTelemetry('heartbeat');
    }
  }, 25000);

  // Tab unload / navigation away handler
  function handleLeave() {
    emitTelemetry('leave');
  }

  window.addEventListener('pagehide', handleLeave);
  window.addEventListener('beforeunload', handleLeave);
})();
