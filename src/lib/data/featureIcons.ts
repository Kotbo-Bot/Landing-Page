/**
 * L'emoji du bot (`static/ktb/`) qui illustre chaque page fonctionnalité.
 *
 * DESIGN.md : un picto sur la page est un picto que le produit utilise. Les
 * clés sont celles du registre des modules du bot (`MODULE_REGISTRY`), qui
 * sont aussi les clés des pages rédigées dans le dashboard. Une page à clé
 * inconnue prend l'étoile.
 */
const ICONS: Record<string, string> = {
	sanctions: 'ban',
	automod: 'shield',
	logs: 'msg',
	nickname_moderation: 'mod',
	double_accounts: 'profile',
	raid_protection: 'lock',
	ban_appeals: 'unlock',
	codepolice: 'warn',
	security_verification: 'check',
	recruitment: 'profile',
	staff_directory: 'mod',
	staff_roles: 'crown',
	tutoring: 'star',
	meetings: 'cal',
	absences: 'clock',
	polls: 'stats',
	discipline: 'warn',
	evaluations: 'trophy',
	leveling: 'level',
	seasons: 'trophy',
	prestige: 'crown',
	clans: 'rpg_sword',
	drops: 'coins',
	economy: 'coins',
	marketplace: 'rpg_shop',
	quests: 'rpg_daily',
	reputation: 'star',
	fun: 'fire',
	daily_algo: 'fire',
	tickets: 'ticket',
	giveaways: 'gold',
	events: 'cal',
	suggestions: 'info',
	starboard: 'star',
	regulation: 'news',
	welcome_goodbye: 'msg',
	reaction_roles: 'check',
	auto_responses: 'msg',
	auto_thread: 'msg',
	news: 'news',
	campaigns: 'news',
	embed_builder: 'settings',
	translation: 'link',
	digest: 'news',
	custom_forms: 'info',
	analytics: 'stats',
	youtube: 'yt',
	twitch: 'twitch',
	social_networks: 'link',
	workflows: 'settings',
	channel_health: 'stats',
	bump_reminder: 'clock',
	channel_links: 'link',
	partnerships: 'link',
	staff_server: 'mod',
};

export function featureIcon(key: string): string {
	return ICONS[key] ?? 'star';
}
