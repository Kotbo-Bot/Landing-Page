function colorFor(seed: string, offset = 0): string {
  let hash = offset;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `hsl(${hash % 360} 62% 48%)`;
}

export function mockAvatar(seed: string): string {
  const initials = seed.trim().slice(0, 2).toUpperCase().replace(/[<>&"']/g, '') || 'K';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="${colorFor(seed)}"/><circle cx="48" cy="38" r="20" fill="rgba(255,255,255,.24)"/><path d="M17 91c3-23 15-34 31-34s28 11 31 34" fill="rgba(255,255,255,.24)"/><text x="48" y="55" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" font-weight="800" fill="white">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function mockBanner(seed: string): string {
  const first = colorFor(seed, 17);
  const second = colorFor(seed, 83);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${first}"/><stop offset="1" stop-color="${second}"/></linearGradient></defs><rect width="800" height="240" fill="url(#g)"/><circle cx="650" cy="30" r="170" fill="rgba(255,255,255,.12)"/><circle cx="120" cy="230" r="190" fill="rgba(0,0,0,.12)"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
