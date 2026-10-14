<script lang="ts">
  import Seo from '$lib/seo/Seo.svelte';
  import { base } from '$app/paths';
  import LegalPageLayout from '$lib/components/LegalPageLayout.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';

  const TEXT = {
    fr: {
      title: "Conditions Générales d'Utilisation",
      subtitle: 'Dernière mise à jour : 20 juillet 2026 · Bot Discord Kotbo et Dashboard associé',
      metaDescription: "Conditions générales d'utilisation du bot Discord Kotbo et de son dashboard : accès, obligations, usages interdits, disponibilité, responsabilité et droit applicable.",
      sections: {
        objet: 'Objet & éditeur',
        acces: 'Accès & âge minimal',
        admin: "Rôle de l'administrateur",
        interdits: 'Usages interdits',
        suspension: 'Suspension & blacklist',
        disponibilite: 'Disponibilité & maintenance',
        responsabilite: 'Responsabilité',
        pi: 'Propriété intellectuelle',
        contenus: 'Contenus des utilisateurs',
        discord: 'Dépendance à Discord',
        donnees: 'Données personnelles',
        modification: 'Modification des CGU',
        droit: 'Droit applicable',
      },
      warn: {
        title: 'Acceptation des présentes conditions',
        body1: "En invitant le bot Kotbo sur un serveur Discord, en accédant au dashboard ou en utilisant l'une de ses fonctionnalités, vous acceptez les présentes Conditions Générales d'Utilisation (« CGU »). Si vous n'acceptez pas ces conditions, n'utilisez pas le service. Le traitement des données personnelles est décrit séparément dans la",
        link: 'politique de confidentialité',
        body2: '.',
      },
      s01: {
        h2: 'Objet & éditeur du service',
        p1a: 'Kotbo est un bot Discord et un tableau de bord web destinés aux communautés francophones (gestion du staff, modération, tickets, statistiques, niveaux, événements, candidatures, économie et organisation de serveur). Le service est édité et exploité par une entreprise individuelle immatriculée sous le SIREN 101 303 535 (« Kotbo », « nous »), et développé par',
        p1b: 'et',
        p1c: '. Les coordonnées complètes figurent sur la page',
        p1link: 'Mentions légales',
        p1d: '.',
        p2a: "L'accès à Kotbo est payant. Les modalités commerciales — offres, prix, TVA, essai gratuit, reconduction, résiliation, rétractation et garanties — font l'objet des",
        p2link: 'Conditions Générales de Vente',
        p2b: ', acceptées lors de la souscription. En cas de contradiction sur un point commercial, les CGV prévalent sur les présentes CGU.',
      },
      s02: {
        h2: 'Accès & âge minimal',
        li1: "L'utilisation de Kotbo suppose un compte Discord valide et le respect des Conditions de Discord.",
        li2: "Vous devez avoir l'âge minimal requis par Discord dans votre pays (au moins 13 ans, 16 ans dans certains pays de l'UE).",
        li3: "L'invitation du bot sur un serveur requiert les permissions Discord appropriées ; seul un administrateur du serveur peut l'installer et le configurer.",
      },
      s03: {
        h2: "Rôle et obligations de l'administrateur",
        p1: "L'administrateur qui installe et configure Kotbo est responsable de son usage sur son serveur. À ce titre, il s'engage à :",
        li1a: "n'activer que les modules pour lesquels il dispose d'une base légale, et informer ses membres (voir",
        li1link: "modèle d'information",
        li1b: ') ;',
        li2: 'informer préalablement ses membres avant d\'activer les modules les plus intrusifs (journalisation complète des messages, vérification anti multi-comptes, suivi détaillé du staff) ;',
        li3: "configurer les permissions du staff selon le besoin d'en connaître ;",
        li4: 'ne pas utiliser Kotbo pour surveiller ou cibler illégalement des personnes, ni pour collecter des données sensibles sans base légale ;',
        li5a: 'répondre aux demandes des personnes concernant les traitements dont il est responsable (voir',
        li5link: 'DPA',
        li5b: ').',
      },
      s04: {
        h2: 'Usages interdits',
        p1: 'Il est notamment interdit d\'utiliser Kotbo pour :',
        li1: 'enfreindre la loi, les Conditions de Discord ou les droits de tiers ;',
        li2: 'harceler, menacer, diffamer ou porter atteinte à autrui ;',
        li3: 'diffuser des contenus illégaux, haineux, pédopornographiques ou manifestement offensants ;',
        li4: "tenter d'accéder sans autorisation au service, à ses données ou à celles d'autres serveurs ;",
        li5: 'contourner les limitations techniques, surcharger ou perturber le service (spam, abus d\'API, déni de service) ;',
        li6: "revendre, redistribuer ou exploiter le service en dehors de son usage prévu ;",
        li7: 'utiliser le service pour contourner une sanction ou usurper une identité.',
      },
      s05: {
        h2: 'Suspension, blacklist & suppression',
        p1: 'Nous pouvons, à tout moment et sans préavis en cas de risque, <strong>suspendre ou restreindre</strong> l\'accès d\'un utilisateur ou d\'un serveur, l\'inscrire sur une <strong>blacklist globale</strong>, ou retirer le bot, en cas de : violation des présentes CGU ou des règles de Discord, abus, risque de sécurité, ou obligation légale.',
        p1a: 'Nous pouvons, à tout moment et sans préavis en cas de risque,',
        p1strong1: 'suspendre ou restreindre',
        p1b: "l'accès d'un utilisateur ou d'un serveur, l'inscrire sur une",
        p1strong2: 'blacklist globale',
        p1c: ', ou retirer le bot, en cas de : violation des présentes CGU ou des règles de Discord, abus, risque de sécurité, ou obligation légale.',
        p2a: 'Un serveur peut cesser d\'utiliser Kotbo à tout moment en retirant le bot. Les conséquences sur les données sont décrites dans la',
        p2link: 'politique de confidentialité',
        p2b: '(durées de conservation).',
      },
      s06: {
        h2: 'Disponibilité & maintenance',
        p1: "Le service est fourni « en l'état » et « selon disponibilité ». Nous ne garantissons pas une disponibilité continue ni l'absence d'erreurs. Des interruptions peuvent survenir pour maintenance, mise à jour, incident technique ou cause extérieure (dont une indisponibilité de Discord). Nous pouvons faire évoluer, limiter ou arrêter tout ou partie des fonctionnalités.",
      },
      s07: {
        h2: 'Limitation de responsabilité',
        p1: "Dans les limites permises par la loi, Kotbo ne saurait être tenu responsable des dommages indirects, de la perte de données, de la perte d'exploitation ou d'un usage non conforme du service par un administrateur ou un membre. Notre responsabilité est limitée aux dommages directs et prévisibles résultant d'une faute qui nous serait imputable. Rien dans les présentes ne limite une responsabilité qui ne peut légalement l'être.",
      },
      s08: {
        h2: 'Propriété intellectuelle & licence',
        p1: "Le nom, les logos, l'interface et le code de Kotbo restent la propriété de leurs auteurs. L'utilisation du service vous confère un droit d'usage personnel, non exclusif et non transférable, limité au fonctionnement prévu. Aucune disposition ne vous cède de droit de propriété intellectuelle sur le service.",
      },
      s09: {
        h2: 'Contenus fournis par les utilisateurs',
        p1: 'Vous restez responsable des contenus que vous fournissez via Kotbo (messages, candidatures, tickets, suggestions, etc.). Vous garantissez disposer des droits nécessaires et que ces contenus ne sont pas illicites. Nous pouvons retirer ou refuser tout contenu contraire aux présentes CGU ou à la loi.',
      },
      s10: {
        h2: 'Dépendance à Discord',
        p1a: 'Kotbo fonctionne sur la plateforme Discord et dépend de son API. Votre utilisation reste soumise aux',
        p1link1: 'Conditions',
        p1b: 'et aux',
        p1link2: 'politiques',
        p1c: "de Discord. Kotbo n'est ni affilié à, ni approuvé par Discord Inc.",
      },
      s11: {
        h2: 'Données personnelles',
        p1a: 'Le traitement des données personnelles est régi par la',
        p1link1: 'politique de confidentialité',
        p1b: ', la',
        p1link2: 'politique cookies',
        p1c: "et, pour la relation avec les administrateurs, l'",
        p1link3: 'accord de sous-traitance (DPA)',
        p1d: '.',
      },
      s12: {
        h2: 'Modification des CGU',
        p1: "Nous pouvons modifier les présentes CGU pour refléter des évolutions du service ou de la réglementation. En cas de modification substantielle, une information est fournie via le serveur Discord officiel et/ou le dashboard, et la date en tête de page est mise à jour. La poursuite de l'utilisation après entrée en vigueur vaut acceptation.",
      },
      s13: {
        h2: 'Droit applicable & juridiction',
        p1a: 'Les présentes CGU sont régies par le',
        p1strong: 'droit français',
        p1b: '. En cas de litige, et à défaut de résolution amiable, les tribunaux français sont compétents, sous réserve des règles impératives de protection des consommateurs. Pour toute question :',
      },
    },
    en: {
      title: 'Terms of Use',
      subtitle: 'Last updated: July 20, 2026 · Kotbo Discord bot and associated Dashboard',
      metaDescription: 'Terms of use for the Kotbo Discord bot and its dashboard: access, obligations, prohibited uses, availability, liability, and applicable law.',
      sections: {
        objet: 'Purpose & publisher',
        acces: 'Access & minimum age',
        admin: "Administrator's role",
        interdits: 'Prohibited uses',
        suspension: 'Suspension & blacklist',
        disponibilite: 'Availability & maintenance',
        responsabilite: 'Liability',
        pi: 'Intellectual property',
        contenus: 'User-provided content',
        discord: 'Dependence on Discord',
        donnees: 'Personal data',
        modification: 'Changes to these Terms',
        droit: 'Governing law',
      },
      warn: {
        title: 'Acceptance of these terms',
        body1: 'By inviting the Kotbo bot to a Discord server, accessing the dashboard, or using any of its features, you accept these Terms of Use ("Terms"). If you do not accept these terms, do not use the service. The processing of personal data is described separately in the',
        link: 'Privacy Policy',
        body2: '.',
      },
      s01: {
        h2: 'Purpose & publisher of the service',
        p1a: 'Kotbo is a Discord bot and a web dashboard designed for French-speaking communities (staff management, moderation, tickets, statistics, levels, events, applications, economy, and server organization). The service is published and operated by a sole proprietorship registered under SIREN 101 303 535 ("Kotbo", "we"), and developed by',
        p1b: 'and',
        p1c: '. Full contact details are available on the',
        p1link: 'Legal Notice',
        p1d: 'page.',
        p2a: 'Access to Kotbo is paid. The commercial terms — offers, pricing, VAT, free trial, renewal, termination, withdrawal, and warranties — are set out in the',
        p2link: 'Terms of Sale',
        p2b: ', accepted upon subscription. In the event of a conflict on a commercial matter, the Terms of Sale prevail over these Terms of Use.',
      },
      s02: {
        h2: 'Access & minimum age',
        li1: 'Using Kotbo requires a valid Discord account and compliance with Discord\'s Terms of Service.',
        li2: "You must meet the minimum age required by Discord in your country (at least 13, or 16 in certain EU countries).",
        li3: 'Inviting the bot to a server requires the appropriate Discord permissions; only a server administrator may install and configure it.',
      },
      s03: {
        h2: "Role and obligations of the administrator",
        p1: 'The administrator who installs and configures Kotbo is responsible for its use on their server. As such, they undertake to :',
        li1a: 'only enable modules for which they have a legal basis, and inform their members (see the',
        li1link: 'information template',
        li1b: ') ;',
        li2: 'inform members in advance before enabling the most intrusive modules (full message logging, anti-multi-account verification, detailed staff tracking) ;',
        li3: 'configure staff permissions according to the need-to-know principle ;',
        li4: 'not use Kotbo to unlawfully monitor or target individuals, nor to collect sensitive data without a legal basis ;',
        li5a: 'respond to data subject requests concerning the processing for which they are the controller (see the',
        li5link: 'DPA',
        li5b: ').',
      },
      s04: {
        h2: 'Prohibited uses',
        p1: 'It is in particular prohibited to use Kotbo to :',
        li1: "violate the law, Discord's Terms of Service, or third-party rights ;",
        li2: 'harass, threaten, defame, or harm others ;',
        li3: 'distribute illegal, hateful, child sexual abuse material, or manifestly offensive content ;',
        li4: "attempt to gain unauthorized access to the service, its data, or that of other servers ;",
        li5: 'circumvent technical limitations, overload, or disrupt the service (spam, API abuse, denial of service) ;',
        li6: 'resell, redistribute, or exploit the service outside its intended use ;',
        li7: "use the service to evade a sanction or impersonate an identity.",
      },
      s05: {
        h2: 'Suspension, blacklist & removal',
        p1a: 'We may, at any time and without notice in the event of risk,',
        p1strong1: 'suspend or restrict',
        p1b: "a user's or a server's access, place it on a",
        p1strong2: 'global blacklist',
        p1c: ', or remove the bot, in the event of : a violation of these Terms or of Discord rules, abuse, a security risk, or a legal obligation.',
        p2a: 'A server may stop using Kotbo at any time by removing the bot. The consequences for the data are described in the',
        p2link: 'Privacy Policy',
        p2b: '(retention periods).',
      },
      s06: {
        h2: 'Availability & maintenance',
        p1: 'The service is provided "as is" and "as available". We do not guarantee continuous availability or the absence of errors. Interruptions may occur for maintenance, updates, technical incidents, or external causes (including a Discord outage). We may change, limit, or discontinue all or part of the features.',
      },
      s07: {
        h2: 'Limitation of liability',
        p1: 'To the extent permitted by law, Kotbo shall not be held liable for indirect damages, data loss, loss of business, or non-compliant use of the service by an administrator or a member. Our liability is limited to direct and foreseeable damages resulting from a fault attributable to us. Nothing in these Terms limits any liability that cannot legally be limited.',
      },
      s08: {
        h2: 'Intellectual property & license',
        p1: "Kotbo's name, logos, interface, and code remain the property of their authors. Use of the service grants you a personal, non-exclusive, non-transferable right of use, limited to its intended operation. Nothing herein transfers any intellectual property rights in the service to you.",
      },
      s09: {
        h2: 'User-provided content',
        p1: 'You remain responsible for the content you provide via Kotbo (messages, applications, tickets, suggestions, etc.). You warrant that you hold the necessary rights and that such content is not unlawful. We may remove or refuse any content that violates these Terms or the law.',
      },
      s10: {
        h2: 'Dependence on Discord',
        p1a: "Kotbo operates on the Discord platform and depends on its API. Your use remains subject to Discord's",
        p1link1: 'Terms',
        p1b: 'and',
        p1link2: 'policies',
        p1c: '. Kotbo is neither affiliated with nor endorsed by Discord Inc.',
      },
      s11: {
        h2: 'Personal data',
        p1a: 'The processing of personal data is governed by the',
        p1link1: 'Privacy Policy',
        p1b: ', the',
        p1link2: 'Cookie Policy',
        p1c: 'and, for the relationship with administrators, the',
        p1link3: 'data processing agreement (DPA)',
        p1d: '.',
      },
      s12: {
        h2: 'Changes to these Terms',
        p1: 'We may amend these Terms to reflect changes to the service or to applicable regulations. In the event of a material change, notice will be provided via the official Discord server and/or the dashboard, and the date at the top of the page will be updated. Continued use of the service after such changes take effect constitutes acceptance.',
      },
      s13: {
        h2: 'Governing law & jurisdiction',
        p1a: 'These Terms are governed by',
        p1strong: 'French law',
        p1b: '. In the event of a dispute, and failing an amicable resolution, the French courts shall have jurisdiction, subject to mandatory consumer protection rules. For any question :',
      },
    },
  };

  const t = $derived(TEXT[getLocale()]);

  const sections = $derived([
    { id: 'objet',        label: t.sections.objet },
    { id: 'acces',        label: t.sections.acces },
    { id: 'admin',        label: t.sections.admin },
    { id: 'interdits',    label: t.sections.interdits },
    { id: 'suspension',   label: t.sections.suspension },
    { id: 'disponibilite',label: t.sections.disponibilite },
    { id: 'responsabilite',label: t.sections.responsabilite },
    { id: 'pi',           label: t.sections.pi },
    { id: 'contenus',     label: t.sections.contenus },
    { id: 'discord',      label: t.sections.discord },
    { id: 'donnees',      label: t.sections.donnees },
    { id: 'modification', label: t.sections.modification },
    { id: 'droit',        label: t.sections.droit },
  ]);
</script>

<Seo title="Conditions Générales d'Utilisation | Kotbo" description={t.metaDescription} path="/terms" />

<LegalPageLayout
  title={t.title}
  subtitle={t.subtitle}
  {sections}
>
  <div class="info-box warn mb-10">
    <p class="font-bold mb-1">{t.warn.title}</p>
    <p class="mb-0">
      {t.warn.body1}
      <a href="{base}/privacy">{t.warn.link}</a>{t.warn.body2}
    </p>
  </div>

  <section id="objet" class="policy-section">
    <div class="section-badge">01</div>
    <h2>{t.s01.h2}</h2>
    <p>
      {t.s01.p1a} <strong>Elouan Passereau</strong> {t.s01.p1b} <strong>Nathan Rontey</strong>{t.s01.p1c}
      <a href="{base}/mentions-legales">{t.s01.p1link}</a>{t.s01.p1d}
    </p>
    <p>
      {t.s01.p2a} <a href="{base}/cgv">{t.s01.p2link}</a>{t.s01.p2b}
    </p>
  </section>

  <section id="acces" class="policy-section">
    <div class="section-badge">02</div>
    <h2>{t.s02.h2}</h2>
    <ul>
      <li>{t.s02.li1}</li>
      <li>{t.s02.li2}</li>
      <li>{t.s02.li3}</li>
    </ul>
  </section>

  <section id="admin" class="policy-section">
    <div class="section-badge">03</div>
    <h2>{t.s03.h2}</h2>
    <p>{t.s03.p1}</p>
    <ul>
      <li>{t.s03.li1a} <a href="{base}/admin-notice">{t.s03.li1link}</a>{t.s03.li1b}</li>
      <li>{t.s03.li2}</li>
      <li>{t.s03.li3}</li>
      <li>{t.s03.li4}</li>
      <li>{t.s03.li5a} <a href="{base}/dpa">{t.s03.li5link}</a>{t.s03.li5b}</li>
    </ul>
  </section>

  <section id="interdits" class="policy-section">
    <div class="section-badge">04</div>
    <h2>{t.s04.h2}</h2>
    <p>{t.s04.p1}</p>
    <ul>
      <li>{t.s04.li1}</li>
      <li>{t.s04.li2}</li>
      <li>{t.s04.li3}</li>
      <li>{t.s04.li4}</li>
      <li>{t.s04.li5}</li>
      <li>{t.s04.li6}</li>
      <li>{t.s04.li7}</li>
    </ul>
  </section>

  <section id="suspension" class="policy-section">
    <div class="section-badge">05</div>
    <h2>{t.s05.h2}</h2>
    <p>
      {t.s05.p1a} <strong>{t.s05.p1strong1}</strong> {t.s05.p1b} <strong>{t.s05.p1strong2}</strong>{t.s05.p1c}
    </p>
    <p>
      {t.s05.p2a} <a href="{base}/privacy">{t.s05.p2link}</a> {t.s05.p2b}
    </p>
  </section>

  <section id="disponibilite" class="policy-section">
    <div class="section-badge">06</div>
    <h2>{t.s06.h2}</h2>
    <p>
      {t.s06.p1}
    </p>
  </section>

  <section id="responsabilite" class="policy-section">
    <div class="section-badge">07</div>
    <h2>{t.s07.h2}</h2>
    <p>
      {t.s07.p1}
    </p>
  </section>

  <section id="pi" class="policy-section">
    <div class="section-badge">08</div>
    <h2>{t.s08.h2}</h2>
    <p>
      {t.s08.p1}
    </p>
  </section>

  <section id="contenus" class="policy-section">
    <div class="section-badge">09</div>
    <h2>{t.s09.h2}</h2>
    <p>
      {t.s09.p1}
    </p>
  </section>

  <section id="discord" class="policy-section">
    <div class="section-badge">10</div>
    <h2>{t.s10.h2}</h2>
    <p>
      {t.s10.p1a}
      <a href="https://discord.com/terms" target="_blank" rel="noopener noreferrer">{t.s10.p1link1}</a> {t.s10.p1b}
      <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer">{t.s10.p1link2}</a> {t.s10.p1c}
    </p>
  </section>

  <section id="donnees" class="policy-section">
    <div class="section-badge">11</div>
    <h2>{t.s11.h2}</h2>
    <p>
      {t.s11.p1a} <a href="{base}/privacy">{t.s11.p1link1}</a>{t.s11.p1b}
      <a href="{base}/cookies">{t.s11.p1link2}</a> {t.s11.p1c}
      <a href="{base}/dpa">{t.s11.p1link3}</a>{t.s11.p1d}
    </p>
  </section>

  <section id="modification" class="policy-section">
    <div class="section-badge">12</div>
    <h2>{t.s12.h2}</h2>
    <p>
      {t.s12.p1}
    </p>
  </section>

  <section id="droit" class="policy-section">
    <div class="section-badge">13</div>
    <h2>{t.s13.h2}</h2>
    <p>
      {t.s13.p1a} <strong>{t.s13.p1strong}</strong>{t.s13.p1b} <a href="mailto:contact@kotbo.fr">contact@kotbo.fr</a>.
    </p>
  </section>
</LegalPageLayout>
