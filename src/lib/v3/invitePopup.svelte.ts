/**
 * Gestion de la fenêtre popup d'autorisation Discord OAuth2 sur kotbo.fr.
 *
 * Ouvre l'autorisation Discord dans une popup centrée pour garder le contexte
 * de la landing, écoute `KOTBO_BOT_INSTALLED` via `postMessage` puis redirige
 * instantanément vers l'onboarding du dashboard sans repasser par l'accueil.
 * Si les popups sont bloquées, l'appelant retombe sur la redirection classique.
 */
import { browser } from '$app/environment';
import { inviteUrl, normalizeInviteContent, writeAttributionCookie } from '$lib/funnel';

const ALLOWED_ORIGINS = new Set([
  'https://api.kotbo.fr',
  'https://dash.kotbo.fr',
  'http://localhost:8787',
  'http://localhost:5173',
  'http://127.0.0.1:8787',
  'http://127.0.0.1:5173',
]);

function isSafeRedirectUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:') {
      return parsed.hostname === 'dash.kotbo.fr' || parsed.hostname.endsWith('.kotbo.fr');
    }
    return parsed.protocol === 'http:' && (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1');
  } catch {
    return false;
  }
}

class InvitePopupStore {
  open = $state(false);
  fallbackUrl = $state('');
  private popupRef: Window | null = null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private listening = false;

  private cleanupListeners() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    if (browser && this.listening) {
      window.removeEventListener('message', this.handleMessage);
      this.listening = false;
    }
    this.popupRef = null;
  }

  private handleMessage = (event: MessageEvent) => {
    if (!ALLOWED_ORIGINS.has(event.origin)) return;
    const data = event.data as { type?: unknown; guildId?: unknown; redirectUrl?: unknown } | null;
    if (!data || data.type !== 'KOTBO_BOT_INSTALLED') return;
    if (!isSafeRedirectUrl(data.redirectUrl)) return;

    this.cleanupListeners();
    this.open = false;
    window.location.href = data.redirectUrl;
  };

  launch(content: string, kit: string | null = null): boolean {
    if (!browser) return false;

    const normalized = normalizeInviteContent(content) || content;
    writeAttributionCookie(normalized);

    const popupUrl = inviteUrl(normalized, kit, { popup: true });
    this.fallbackUrl = inviteUrl(normalized, kit);

    const width = 500;
    const height = 780;
    const dualScreenLeft = window.screenLeft ?? window.screenX ?? 0;
    const dualScreenTop = window.screenTop ?? window.screenY ?? 0;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || screen.width;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || screen.height;
    const left = Math.max(0, Math.round(dualScreenLeft + (viewportWidth - width) / 2));
    const top = Math.max(0, Math.round(dualScreenTop + (viewportHeight - height) / 2));

    const win = window.open(
      popupUrl,
      'kotbo_oauth',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=yes,status=no,resizable=yes,scrollbars=yes`,
    );

    if (!win || win.closed || typeof win.closed === 'undefined') {
      return false;
    }

    this.cleanupListeners();
    this.popupRef = win;
    this.open = true;

    window.addEventListener('message', this.handleMessage);
    this.listening = true;

    this.pollTimer = setInterval(() => {
      if (!this.popupRef || this.popupRef.closed) {
        this.close();
      }
    }, 500);

    return true;
  }

  focusPopup() {
    if (this.popupRef && !this.popupRef.closed) {
      this.popupRef.focus();
    } else if (this.fallbackUrl) {
      this.continueInTab();
    }
  }

  continueInTab() {
    const url = this.fallbackUrl;
    try {
      if (this.popupRef && !this.popupRef.closed) this.popupRef.close();
    } catch {
      // ignore cross-origin close errors
    }
    this.close();
    if (url && browser) {
      window.location.href = url;
    }
  }

  close() {
    this.cleanupListeners();
    this.open = false;
  }
}

export const invitePopup = new InvitePopupStore();
