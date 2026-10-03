/**
 * Tourne les plans du film : chaque écran du vrai dashboard de démo, en FR et
 * en EN, capturé à 2× pour supporter les zooms.
 *
 * Le dashboard de démo est celui servi par le site sous `/demo/` : lancer
 * `bun run dev -- --port 5199` à la racine du dépôt avant ce script.
 * Les captures atterrissent dans `public/shots/<locale>/<plan>.png`.
 *
 * Variables : `DEMO_URL` (défaut http://localhost:5199/demo), `CHROME_PATH`
 * pour pointer un Chromium si playwright-core n'en trouve pas.
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DEMO_URL = process.env.DEMO_URL ?? 'http://localhost:5199/demo';
const OUT = new URL('../public/shots/', import.meta.url);

/** Un plan par écran montré dans le film. Les chemins sont ceux du dashboard. */
const SHOTS = {
  home: '/',
  sanctions: '/security/sanctions',
  filters: '/security/filters',
  antiraid: '/security/anti-raid',
  accounts: '/security/accounts',
  logs: '/logs',
  staff: '/staff-management/members',
  roles: '/staff-management/roles',
  planning: '/planning',
  recruitment: '/recruitment',
  tickets: '/tickets',
  leveling: '/leveling',
  economy: '/economy',
  giveaways: '/giveaways',
  events: '/events',
  forms: '/forms',
  welcome: '/welcome',
  reactionroles: '/reaction-roles',
  analytics: '/analytics',
  channelhealth: '/channel-health',
  pulse: '/pulse',
  modules: '/modules',
  mcp: '/mcp-settings',
  members: '/members',
};

const only = process.argv.slice(2);
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});

for (const locale of ['fr', 'en']) {
  mkdirSync(new URL(`${locale}/`, OUT), { recursive: true });
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
  // Visite guidée marquée comme vue partout, langue imposée, avant tout script de la page.
  await context.addInitScript(
    ([lang, paths]) => {
      localStorage.setItem('PARAGLIDE_LOCALE', lang);
      localStorage.setItem('kotbo_demo_tour_seen', '1');
      localStorage.setItem('kotbo_demo_page_tours_seen', JSON.stringify(paths));
    },
    [locale, Object.values(SHOTS)],
  );
  const page = await context.newPage();

  for (const [name, path] of Object.entries(SHOTS)) {
    if (only.length && !only.includes(name)) continue;
    await page.goto(DEMO_URL + path, { waitUntil: 'load' });
    await page.waitForTimeout(3500);
    // Le bandeau « Mode démonstration » et les bulles d'aide ne font pas partie du produit filmé.
    await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        if (!/Mode Démonstration|Demo mode|Demo Mode/i.test(walker.currentNode.nodeValue ?? '')) continue;
        // On remonte jusqu'au premier bloc qui porte aussi les boutons du bandeau.
        let el = walker.currentNode.parentElement;
        while (el && el.querySelectorAll('button').length < 2) el = el.parentElement;
        // Puis jusqu'au cadre du bandeau : les enveloppes qui ne contiennent que lui.
        while (el?.parentElement && el.parentElement.children.length === 1) el = el.parentElement;
        el?.remove();
        break;
      }
      // La carte « Guide » d'un module se ferme comme le ferait un habitué.
      for (const button of document.querySelectorAll('button')) {
        if (/^(Compris|Got it)$/.test(button.textContent?.trim() ?? '')) button.click();
      }
      document.querySelectorAll('[role="dialog"]').forEach((el) => el.remove());
    });
    await page.waitForTimeout(700);
    await page.screenshot({ path: fileURLToPath(new URL(`${locale}/${name}.png`, OUT)) });
    console.log(locale, name);
  }
  await context.close();
}

await browser.close();
