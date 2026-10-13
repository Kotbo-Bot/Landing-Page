/**
 * Les « salons » de l'accueil v3 : la page se lit comme un serveur Discord.
 *
 * Chaque zone de l'accueil est un salon, avec son nom et son sujet, comme la
 * barre du haut d'un vrai salon. La colonne de gauche (`Channels.svelte`) les
 * liste par catégorie, et chaque zone ouvre sur sa barre (`ChannelHeader`).
 * `id` est l'ancre de la zone : les autres pages y renvoient
 * (`sections/SiteNav.svelte`, `FeatureTry`, `StaffPage`), ne pas la renommer
 * sans elles.
 */
import type { Locale } from '$lib/i18n/state.svelte';

export type ChannelId = 'bienvenue' | 'nuit' | 'qg' | 'addition' | 'modules' | 'setup' | 'confiance' | 'prix' | 'faq';

export interface Channel {
  id: ChannelId;
  name: string;
  topic: string;
}

export interface ChannelGroup {
  label: string;
  channels: Channel[];
}

export const CHANNELS: Record<Locale, ChannelGroup[]> = {
  fr: [
    {
      label: 'Commence ici',
      channels: [
        { id: 'bienvenue', name: 'bienvenue', topic: 'Kotbo en trois secondes' },
        { id: 'nuit', name: '2h47', topic: 'la vie de fonda, sans Kotbo' },
      ],
    },
    {
      label: 'Kotbo',
      channels: [
        { id: 'qg', name: 'qg-staff', topic: 'les vrais écrans du dashboard' },
        { id: 'addition', name: 'l-addition', topic: 'ce que te coûte ta pile de bots' },
        { id: 'modules', name: 'modules', topic: '51 modules, tous dans l’abonnement' },
      ],
    },
    {
      label: 'Ton serveur',
      channels: [
        { id: 'setup', name: 'setup', topic: 'dis-nous quel serveur t’as' },
        { id: 'confiance', name: 'co-fondateurs', topic: 'avant d’ajouter un énième bot' },
        { id: 'prix', name: 'prix', topic: 'un curseur, un prix' },
        { id: 'faq', name: 'faq', topic: 'tout le reste' },
      ],
    },
  ],
  en: [
    {
      label: 'Start here',
      channels: [
        { id: 'bienvenue', name: 'welcome', topic: 'Kotbo in three seconds' },
        { id: 'nuit', name: '2-47am', topic: 'owner life, without Kotbo' },
      ],
    },
    {
      label: 'Kotbo',
      channels: [
        { id: 'qg', name: 'staff-hq', topic: 'the real dashboard screens' },
        { id: 'addition', name: 'the-bill', topic: 'what your bot pile costs you' },
        { id: 'modules', name: 'modules', topic: '51 modules, all in the subscription' },
      ],
    },
    {
      label: 'Your server',
      channels: [
        { id: 'setup', name: 'setup', topic: 'tell us what server you run' },
        { id: 'confiance', name: 'co-founders', topic: 'before adding yet another bot' },
        { id: 'prix', name: 'pricing', topic: 'one slider, one price' },
        { id: 'faq', name: 'faq', topic: 'everything else' },
      ],
    },
  ],
};

export function channelOf(locale: Locale, id: ChannelId): Channel {
  for (const group of CHANNELS[locale]) {
    const found = group.channels.find((c) => c.id === id);
    if (found) return found;
  }
  throw new Error(`salon inconnu : ${id}`);
}
