<script lang="ts">
  import Seo from '$lib/seo/Seo.svelte';
  import { base } from '$app/paths';
  import LegalPageLayout from '$lib/components/LegalPageLayout.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';

  const TEXT = {
    fr: {
      title: 'Accord de sous-traitance des données',
      subtitle: 'Version 2.0 du 20 juillet 2026 · Article 28 du RGPD',
      metaDescription: "Accord de sous-traitance (DPA, article 28 RGPD) applicable aux administrateurs utilisant Kotbo : obligations, sous-traitants, transferts, notification d'incident et mesures de sécurité.",
      sections: {
        parties: 'Parties & acceptation',
        objet: 'Objet et durée',
        nature: 'Nature et finalités',
        donnees: 'Données concernées',
        kotbo: 'Obligations de Kotbo',
        administrateur: "Obligations de l'administrateur",
        'sous-traitants': 'Sous-traitants ultérieurs',
        transferts: 'Transferts internationaux',
        violations: 'Violations & notification',
        restitution: 'Restitution & suppression',
        audits: 'Audits',
        toms: 'Annexe — Mesures (TOMs)',
        contact: 'Contact et droits',
      },
      warn: {
        title: 'Répartition des responsabilités',
        body1a: 'L\'administrateur du serveur (le «',
        strong1: 'Responsable',
        body1b: '») détermine les finalités et moyens des traitements propres à sa communauté. Kotbo, exploité par l\'entreprise individuelle immatriculée sous le SIREN 101 303 535 (le «',
        strong2: 'Sous-traitant',
        body1c: '»), agit sur ses instructions pour ces traitements. Pour les traitements de sécurité globale, blacklist globale et journaux techniques, Kotbo agit en revanche comme responsable (voir la',
        link: 'politique de confidentialité',
        body1d: ', §1). Contact :',
      },
      s01: {
        h2: "Parties et modalités d'acceptation",
        table: {
          party: 'Partie',
          identity: 'Identité',
          soustraitant: 'Sous-traitant',
          soustraitantValue: 'Kotbo —',
          soustraitantCode: "[À COMPLÉTER : nom de l'entrepreneur individuel]",
          soustraitantRest: ', entreprise individuelle · SIREN 101 303 535, SIRET 101 303 535 00021 · TVA FR 14 101303535 · contact',
          responsable: 'Responsable',
          responsableValue: "L'administrateur du serveur Discord ayant invité et configuré Kotbo, identifié par son compte Discord et l'identifiant de serveur (Guild ID) concerné.",
        },
        p1strong: 'Acceptation.',
        p1a: 'Le présent accord est réputé accepté par le Responsable lors de l\'invitation du bot et de l\'activation des modules. Une acceptation horodatée et versionnée est enregistrée côté service (identifiant de serveur, identifiant administrateur, numéro de version et date). Le Responsable peut demander une copie de cette trace à',
        infoStrong1: 'Version :',
        infoBody1: '2.0 ·',
        infoStrong2: 'Entrée en vigueur :',
        infoBody2: '20 juillet 2026. Toute nouvelle version substantielle est notifiée (voir §7) et fait l\'objet d\'une nouvelle acceptation enregistrée.',
      },
      s02: {
        h2: 'Objet et durée',
        p1a: 'Kotbo traite, pour le compte du Responsable, les données nécessaires aux modules activés sur son serveur. Le traitement dure pendant la fourniture du service, sous réserve des durées et modalités présentées dans la',
        link: 'politique de confidentialité',
        p1b: '(§7). Il prend fin au retrait du bot ou à la résiliation.',
      },
      s03: {
        h2: 'Nature, finalités et personnes concernées',
        p1: "Les opérations comprennent la collecte (depuis Discord ou des formulaires), l'organisation, la consultation, la modification, l'export et la suppression sur instruction. Les finalités couvrent la gestion communautaire, le staff, la modération, les tickets, les candidatures, les événements, les statistiques, l'économie et les sauvegardes.",
        info: 'Personnes concernées : membres, candidats, participants, membres du staff, modérateurs et administrateurs des serveurs configurés avec Kotbo.',
      },
      s04: {
        h2: 'Données concernées',
        li1: 'identifiants, profils et métadonnées Discord ;',
        li2: 'activité, participations, invitations et statistiques communautaires ;',
        li3: 'contenu des messages lorsque la journalisation est activée par le Responsable ;',
        li4: 'données de vérification de sécurité (IP, appareil, e-mail, connexions, serveurs, preuves de doublon) ;',
        li5: 'contenus des formulaires, candidatures et tickets ;',
        li6: "sanctions, données staff, sauvegardes et journaux d'audit.",
        p1a: 'Le détail complet est publié dans la',
        link: 'politique de confidentialité',
        p1b: '(§2 à §4).',
      },
      s05: {
        h2: 'Instructions et obligations de Kotbo',
        li1: 'traiter les données uniquement sur instructions documentées résultant de la configuration et des demandes du Responsable, y compris pour les transferts ;',
        li2: 'garantir la confidentialité des personnes autorisées et limiter les accès au besoin d\'en connaître ;',
        li3: "mettre en œuvre les mesures techniques et organisationnelles de l'annexe (§12) ;",
        li4: 'informer le Responsable si une instruction paraît contraire au RGPD ;',
        li5: "assister le Responsable pour les demandes de droits, les analyses d'impact, la sécurité et les violations ;",
        li6: 'tenir un registre des catégories d\'activités de traitement effectuées pour le compte du Responsable ;',
        li7: 'mettre à disposition les informations nécessaires à la démonstration de conformité et permettre les audits (§11).',
      },
      s06: {
        h2: "Obligations de l'administrateur (Responsable)",
        li1: 'disposer d\'une base légale pour chaque module activé, informer les membres et limiter les accès du staff ;',
        li2: 'informer préalablement les membres avant d\'activer les modules intrusifs (journalisation des messages, vérification anti multi-comptes, suivi détaillé du staff) ;',
        li3: 'ne collecter que les données pertinentes, définir des durées proportionnées et traiter les demandes des personnes ;',
        li4: 'ne pas utiliser les champs libres pour collecter des données sensibles sans nécessité, base légale et garanties ;',
        li5: 'transmettre des instructions licites et configurer Kotbo conformément au droit applicable.',
        infoA: 'Un',
        infoLink: "modèle d'information des membres",
        infoB: 'est fourni et doit être adapté aux modules, finalités et durées réellement retenus par le serveur.',
      },
      s07: {
        h2: 'Sous-traitants ultérieurs',
        p1a: 'Le Responsable donne une autorisation générale au recours aux prestataires ci-dessous. Kotbo informe de tout ajout ou remplacement',
        p1strong: 'au moins 30 jours avant',
        p1b: "son entrée en vigueur, afin de permettre une objection motivée ; à défaut d'accord, le Responsable peut cesser d'utiliser le module concerné ou retirer le bot.",
        table: {
          provider: 'Prestataire',
          role: 'Fonction',
          location: 'Pays / zone',
          row1Role: 'Hébergement de la base et de l\'infrastructure, sauvegardes',
          row1Location: 'Allemagne (Union européenne)',
          row2Role: 'Réseau, cache et sécurité (WAF, anti-abus)',
          row2Location: 'États-Unis / réseau mondial — clauses contractuelles types',
          row3Role: 'Plateforme source et destination des données',
          row3Location: 'États-Unis — garanties annoncées par Discord',
          row4Name: 'Sentry (Functional Software, Inc.)',
          row4Role: "Diagnostic d'erreurs (si activé)",
          row4Location: 'Selon la région et le contrat configurés',
          row5Name: 'LibreTranslate, YouTube, Twitch',
          row5Role: 'Modules optionnels',
          row5Location: 'Selon le service activé — pas de données personnelles de membres pour YouTube/Twitch',
        },
      },
      s08: {
        h2: 'Transferts internationaux',
        p1a: "Les données sont hébergées dans l'EEE. Les transferts hors EEE éventuels (Discord, Cloudflare, Sentry) sont encadrés par des",
        p1strong: 'clauses contractuelles types',
        p1b: "de la Commission européenne et/ou les mécanismes de conformité des prestataires concernés. Aucun transfert n'est réalisé en dehors de ces garanties.",
      },
      s09: {
        h2: 'Violations de données & notification',
        p1a: 'Kotbo notifie le Responsable',
        p1strong: 'dans les meilleurs délais et au plus tard 48 heures',
        p1b: "après avoir pris connaissance d'une violation affectant ses données, par e-mail à l'adresse de contact du serveur. La notification précise, dans la mesure du possible : la nature de la violation, les catégories et le volume approximatif de données et de personnes concernées, les conséquences probables et les mesures prises ou proposées. Kotbo assiste le Responsable dans son éventuelle notification à l'autorité de contrôle (72 h) et aux personnes concernées.",
      },
      s10: {
        h2: 'Restitution et suppression',
        li1a: 'À la fin du service, les données sont, au choix du Responsable,',
        li1strong1: 'restituées',
        li1b: '(export structuré) puis supprimées, ou directement',
        li1strong2: 'supprimées',
        li1c: '.',
        li2a: 'La suppression des données actives intervient dans un délai de',
        li2strong: '30 jours',
        li2b: "après la fin du service ou une demande recevable.",
        li3a: 'Les copies présentes dans les',
        li3strong1: 'sauvegardes',
        li3b: 'chiffrées expirent selon le cycle de rotation, dans un délai maximal de',
        li3strong2: '35 jours',
        li3c: ', période pendant laquelle elles ne sont plus utilisées activement.',
        li4: "Kotbo peut conserver certaines données si une obligation légale l'impose, en le documentant.",
      },
      s11: {
        h2: 'Audits',
        p1a: 'Kotbo met à disposition les informations nécessaires à la démonstration de conformité. Le Responsable peut demander un audit',
        p1strong1: 'une fois par an',
        p1b: "(ou après un incident), sur",
        p1strong2: 'préavis raisonnable de 30 jours',
        p1c: ', par la fourniture de documentation, un questionnaire de sécurité ou une réunion, sans compromettre la sécurité ni la confidentialité des autres clients. Les audits sur site restent exceptionnels et encadrés.',
      },
      s12: {
        h2: 'Annexe — Mesures techniques et organisationnelles (TOMs)',
        table: {
          domain: 'Domaine',
          measures: 'Mesures',
          row1Domain: 'Chiffrement',
          row1Measures: 'TLS/HTTPS en transit ; jetons Discord chiffrés côté serveur ; clés API stockées en hash SHA-256.',
          row2Domain: "Contrôle d'accès",
          row2Measures: 'OAuth2 Authorization Code, sessions serveur révocables, cookie HttpOnly ; permissions granulaires par serveur ; accès équipe restreint au besoin d\'en connaître.',
          row3Domain: 'Isolation',
          row3Measures: "Cloisonnement logique par serveur (Guild ID) ; un serveur ne peut accéder aux données d'un autre.",
          row4Domain: 'Journalisation',
          row4Measures: 'Journaux d\'audit des actions administratives (auteur, action, horodatage).',
          row5Domain: 'Sauvegardes',
          row5Measures: "Sauvegardes régulières avec contrôle d'intégrité et expiration.",
          row6Domain: 'Minimisation',
          row6Measures: 'Collecte limitée aux modules activés ; profils privés par défaut ; filtrage des secrets dans les journaux.',
          row7Domain: 'Organisation',
          row7Measures: "Obligation de confidentialité de l'équipe ; procédure d'exercice des droits ; revue à chaque nouveau module ou prestataire.",
        },
        warn: "Certaines mesures relèvent de la configuration d'infrastructure de production (TLS de la base, chiffrement et localisation des sauvegardes, isolation effective) et doivent être vérifiées et maintenues à jour indépendamment du code source public.",
      },
      s13: {
        h2: 'Contact et exercice des droits',
        p1a: 'Les demandes, instructions et questions contractuelles sont adressées à',
        infoA: 'Consultez également la',
        infoLink1: 'politique de confidentialité',
        infoB: ', les',
        infoLink2: 'CGU',
        infoC: ', la',
        infoLink3: 'politique cookies',
        infoD: ', les',
        infoLink4: 'mentions légales',
        infoE: 'et le',
        infoLink5: "modèle d'information des membres",
        infoF: '.',
      },
    },
    en: {
      title: 'Data Processing Agreement',
      subtitle: 'Version 2.0 of July 20, 2026 · Article 28 GDPR',
      metaDescription: 'Data Processing Agreement (DPA, Article 28 GDPR) applicable to administrators using Kotbo: obligations, sub-processors, transfers, incident notification, and security measures.',
      sections: {
        parties: 'Parties & acceptance',
        objet: 'Purpose and duration',
        nature: 'Nature and purposes',
        donnees: 'Data concerned',
        kotbo: "Kotbo's obligations",
        administrateur: "Administrator's obligations",
        'sous-traitants': 'Sub-processors',
        transferts: 'International transfers',
        violations: 'Breaches & notification',
        restitution: 'Return & deletion',
        audits: 'Audits',
        toms: 'Appendix — Security measures (TOMs)',
        contact: 'Contact and rights',
      },
      warn: {
        title: 'Allocation of responsibilities',
        body1a: 'The server administrator (the "',
        strong1: 'Controller',
        body1b: '") determines the purposes and means of the processing specific to their community. Kotbo, operated by the sole proprietorship registered under SIREN 101 303 535 (the "',
        strong2: 'Processor',
        body1c: '"), acts on their instructions for this processing. For global security processing, the global blacklist, and technical logs, Kotbo instead acts as controller (see the',
        link: 'Privacy Policy',
        body1d: ', §1). Contact:',
      },
      s01: {
        h2: 'Parties and acceptance arrangements',
        table: {
          party: 'Party',
          identity: 'Identity',
          soustraitant: 'Processor',
          soustraitantValue: 'Kotbo —',
          soustraitantCode: '[TO BE COMPLETED: name of the sole trader]',
          soustraitantRest: ', sole proprietorship · SIREN 101 303 535, SIRET 101 303 535 00021 · VAT FR 14 101303535 · contact',
          responsable: 'Controller',
          responsableValue: 'The administrator of the Discord server who invited and configured Kotbo, identified by their Discord account and the relevant server identifier (Guild ID).',
        },
        p1strong: 'Acceptance.',
        p1a: 'This agreement is deemed accepted by the Controller upon inviting the bot and enabling modules. A timestamped and versioned acceptance record is stored on the service side (server identifier, administrator identifier, version number, and date). The Controller may request a copy of this record from',
        infoStrong1: 'Version:',
        infoBody1: '2.0 ·',
        infoStrong2: 'Effective date:',
        infoBody2: 'July 20, 2026. Any new material version is notified (see §7) and requires a new recorded acceptance.',
      },
      s02: {
        h2: 'Purpose and duration',
        p1a: 'Kotbo processes, on behalf of the Controller, the data necessary for the modules enabled on their server. Processing lasts for the duration of the service, subject to the durations and arrangements set out in the',
        link: 'Privacy Policy',
        p1b: '(§7). It ends when the bot is removed or upon termination.',
      },
      s03: {
        h2: 'Nature, purposes, and data subjects',
        p1: 'Processing operations include collection (from Discord or forms), organization, consultation, modification, export, and deletion on instruction. The purposes cover community management, staff, moderation, tickets, applications, events, statistics, economy features, and backups.',
        info: 'Data subjects: members, applicants, participants, staff members, moderators, and administrators of servers configured with Kotbo.',
      },
      s04: {
        h2: 'Data concerned',
        li1: 'Discord identifiers, profiles, and metadata;',
        li2: 'activity, participation, invitations, and community statistics;',
        li3: 'message content when logging is enabled by the Controller;',
        li4: 'security verification data (IP address, device, email, connections, servers, duplicate-account evidence);',
        li5: 'form, application, and ticket content;',
        li6: 'sanctions, staff data, backups, and audit logs.',
        p1a: 'Full details are published in the',
        link: 'Privacy Policy',
        p1b: '(§2 to §4).',
      },
      s05: {
        h2: "Instructions and Kotbo's obligations",
        li1: 'process data only on documented instructions arising from the configuration and requests of the Controller, including for transfers;',
        li2: 'ensure the confidentiality of authorized personnel and restrict access to a need-to-know basis;',
        li3: 'implement the technical and organizational measures set out in the appendix (§12);',
        li4: 'inform the Controller if an instruction appears to infringe the GDPR;',
        li5: 'assist the Controller with data subject requests, impact assessments, security, and breaches;',
        li6: 'maintain a record of the categories of processing activities carried out on behalf of the Controller;',
        li7: 'make available the information necessary to demonstrate compliance and allow audits (§11).',
      },
      s06: {
        h2: "Obligations of the administrator (Controller)",
        li1: 'have a legal basis for each module enabled, inform members, and limit staff access;',
        li2: 'inform members in advance before enabling intrusive modules (message logging, anti-multi-account verification, detailed staff tracking);',
        li3: 'collect only relevant data, set proportionate retention periods, and handle data subject requests;',
        li4: 'not use free-text fields to collect sensitive data without necessity, a legal basis, and safeguards;',
        li5: 'issue lawful instructions and configure Kotbo in accordance with applicable law.',
        infoA: 'A',
        infoLink: 'member information template',
        infoB: 'is provided and must be adapted to the modules, purposes, and retention periods actually chosen by the server.',
      },
      s07: {
        h2: 'Sub-processors',
        p1a: 'The Controller grants a general authorization for the use of the providers listed below. Kotbo will notify any addition or replacement',
        p1strong: 'at least 30 days before',
        p1b: 'it takes effect, to allow for a reasoned objection; failing agreement, the Controller may stop using the affected module or remove the bot.',
        table: {
          provider: 'Provider',
          role: 'Role',
          location: 'Country / region',
          row1Role: 'Database and infrastructure hosting, backups',
          row1Location: 'Germany (European Union)',
          row2Role: 'Network, caching, and security (WAF, anti-abuse)',
          row2Location: 'United States / global network — standard contractual clauses',
          row3Role: 'Source and destination platform for the data',
          row3Location: "United States — guarantees announced by Discord",
          row4Name: 'Sentry (Functional Software, Inc.)',
          row4Role: 'Error diagnostics (if enabled)',
          row4Location: 'Depending on the configured region and contract',
          row5Name: 'LibreTranslate, YouTube, Twitch',
          row5Role: 'Optional modules',
          row5Location: 'Depending on the service enabled — no personal member data for YouTube/Twitch',
        },
      },
      s08: {
        h2: 'International transfers',
        p1a: 'Data is hosted within the EEA. Any transfers outside the EEA (Discord, Cloudflare, Sentry) are governed by',
        p1strong: 'standard contractual clauses',
        p1b: 'of the European Commission and/or the compliance mechanisms of the relevant providers. No transfer takes place outside these safeguards.',
      },
      s09: {
        h2: 'Data breaches & notification',
        p1a: 'Kotbo notifies the Controller',
        p1strong: 'as soon as possible and no later than 48 hours',
        p1b: "after becoming aware of a breach affecting their data, by email to the server's contact address. The notification specifies, to the extent possible: the nature of the breach, the categories and approximate volume of data and data subjects affected, the likely consequences, and the measures taken or proposed. Kotbo assists the Controller with any notification to the supervisory authority (72 hours) and to data subjects.",
      },
      s10: {
        h2: 'Return and deletion',
        li1a: 'At the end of the service, the data is, at the Controller\'s choice,',
        li1strong1: 'returned',
        li1b: '(structured export) and then deleted, or directly',
        li1strong2: 'deleted',
        li1c: '.',
        li2a: 'Active data is deleted within',
        li2strong: '30 days',
        li2b: 'of the end of the service or of an admissible request.',
        li3a: 'Copies present in encrypted',
        li3strong1: 'backups',
        li3b: 'expire according to the rotation cycle, within a maximum of',
        li3strong2: '35 days',
        li3c: ', a period during which they are no longer actively used.',
        li4: 'Kotbo may retain certain data where a legal obligation requires it, documenting the reason.',
      },
      s11: {
        h2: 'Audits',
        p1a: 'Kotbo makes available the information necessary to demonstrate compliance. The Controller may request an audit',
        p1strong1: 'once a year',
        p1b: '(or after an incident), on',
        p1strong2: 'reasonable notice of 30 days',
        p1c: ', through the provision of documentation, a security questionnaire, or a meeting, without compromising the security or confidentiality of other customers. On-site audits remain exceptional and are subject to conditions.',
      },
      s12: {
        h2: 'Appendix — Technical and organizational measures (TOMs)',
        table: {
          domain: 'Area',
          measures: 'Measures',
          row1Domain: 'Encryption',
          row1Measures: 'TLS/HTTPS in transit; Discord tokens encrypted server-side; API keys stored as SHA-256 hashes.',
          row2Domain: 'Access control',
          row2Measures: 'OAuth2 Authorization Code flow, revocable server sessions, HttpOnly cookie; granular per-server permissions; team access restricted to a need-to-know basis.',
          row3Domain: 'Isolation',
          row3Measures: 'Logical partitioning by server (Guild ID); one server cannot access another\'s data.',
          row4Domain: 'Logging',
          row4Measures: 'Audit logs of administrative actions (author, action, timestamp).',
          row5Domain: 'Backups',
          row5Measures: 'Regular backups with integrity checks and expiration.',
          row6Domain: 'Minimization',
          row6Measures: 'Collection limited to enabled modules; private profiles by default; filtering of secrets from logs.',
          row7Domain: 'Organization',
          row7Measures: "Team confidentiality obligations; rights-exercise procedure; review upon each new module or provider.",
        },
        warn: 'Certain measures fall under production infrastructure configuration (database TLS, backup encryption and location, effective isolation) and must be verified and kept up to date independently of the public source code.',
      },
      s13: {
        h2: 'Contact and exercise of rights',
        p1a: 'Requests, instructions, and contractual questions should be sent to',
        infoA: 'Also see the',
        infoLink1: 'Privacy Policy',
        infoB: ', the',
        infoLink2: 'Terms of Use',
        infoC: ', the',
        infoLink3: 'Cookie Policy',
        infoD: ', the',
        infoLink4: 'Legal Notice',
        infoE: 'and the',
        infoLink5: 'member information template',
        infoF: '.',
      },
    },
  };

  const t = $derived(TEXT[getLocale()]);

  const sections = $derived([
    { id: 'parties', label: t.sections.parties },
    { id: 'objet', label: t.sections.objet },
    { id: 'nature', label: t.sections.nature },
    { id: 'donnees', label: t.sections.donnees },
    { id: 'kotbo', label: t.sections.kotbo },
    { id: 'administrateur', label: t.sections.administrateur },
    { id: 'sous-traitants', label: t.sections['sous-traitants'] },
    { id: 'transferts', label: t.sections.transferts },
    { id: 'violations', label: t.sections.violations },
    { id: 'restitution', label: t.sections.restitution },
    { id: 'audits', label: t.sections.audits },
    { id: 'toms', label: t.sections.toms },
    { id: 'contact', label: t.sections.contact },
  ]);
</script>

<Seo title="Accord de sous-traitance RGPD | Kotbo" description={t.metaDescription} path="/dpa" />

<LegalPageLayout
  title={t.title}
  subtitle={t.subtitle}
  {sections}
>
  <div class="info-box warn mb-10">
    <p class="font-bold mb-1">{t.warn.title}</p>
    <p class="mb-0">
      {t.warn.body1a}<strong>{t.warn.strong1}</strong>{t.warn.body1b}<strong>{t.warn.strong2}</strong>{t.warn.body1c}
      <a href="{base}/privacy">{t.warn.link}</a>{t.warn.body1d}
      <a href="mailto:privacy@kotbo.fr" class="font-bold underline">privacy@kotbo.fr</a>.
    </p>
  </div>

  <section id="parties" class="policy-section">
    <div class="section-badge">01</div>
    <h2>{t.s01.h2}</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>{t.s01.table.party}</th><th>{t.s01.table.identity}</th></tr></thead>
        <tbody>
          <tr><td>{t.s01.table.soustraitant}</td><td>{t.s01.table.soustraitantValue} <code>{t.s01.table.soustraitantCode}</code>{t.s01.table.soustraitantRest} <a href="mailto:privacy@kotbo.fr">privacy@kotbo.fr</a></td></tr>
          <tr><td>{t.s01.table.responsable}</td><td>{t.s01.table.responsableValue}</td></tr>
        </tbody>
      </table>
    </div>
    <p>
      <strong>{t.s01.p1strong}</strong> {t.s01.p1a} <a href="mailto:privacy@kotbo.fr">privacy@kotbo.fr</a>.
    </p>
    <div class="info-box">
      <strong>{t.s01.infoStrong1}</strong> {t.s01.infoBody1} <strong>{t.s01.infoStrong2}</strong> {t.s01.infoBody2}
    </div>
  </section>

  <section id="objet" class="policy-section">
    <div class="section-badge">02</div>
    <h2>{t.s02.h2}</h2>
    <p>
      {t.s02.p1a} <a href="{base}/privacy">{t.s02.link}</a> {t.s02.p1b}
    </p>
  </section>

  <section id="nature" class="policy-section">
    <div class="section-badge">03</div>
    <h2>{t.s03.h2}</h2>
    <p>
      {t.s03.p1}
    </p>
    <div class="info-box">
      {t.s03.info}
    </div>
  </section>

  <section id="donnees" class="policy-section">
    <div class="section-badge">04</div>
    <h2>{t.s04.h2}</h2>
    <ul>
      <li>{t.s04.li1}</li>
      <li>{t.s04.li2}</li>
      <li>{t.s04.li3}</li>
      <li>{t.s04.li4}</li>
      <li>{t.s04.li5}</li>
      <li>{t.s04.li6}</li>
    </ul>
    <p>{t.s04.p1a} <a href="{base}/privacy">{t.s04.link}</a>{t.s04.p1b}</p>
  </section>

  <section id="kotbo" class="policy-section">
    <div class="section-badge">05</div>
    <h2>{t.s05.h2}</h2>
    <ul>
      <li>{t.s05.li1}</li>
      <li>{t.s05.li2}</li>
      <li>{t.s05.li3}</li>
      <li>{t.s05.li4}</li>
      <li>{t.s05.li5}</li>
      <li>{t.s05.li6}</li>
      <li>{t.s05.li7}</li>
    </ul>
  </section>

  <section id="administrateur" class="policy-section">
    <div class="section-badge">06</div>
    <h2>{t.s06.h2}</h2>
    <ul>
      <li>{t.s06.li1}</li>
      <li>{t.s06.li2}</li>
      <li>{t.s06.li3}</li>
      <li>{t.s06.li4}</li>
      <li>{t.s06.li5}</li>
    </ul>
    <div class="info-box">
      {t.s06.infoA} <a href="{base}/admin-notice">{t.s06.infoLink}</a> {t.s06.infoB}
    </div>
  </section>

  <section id="sous-traitants" class="policy-section">
    <div class="section-badge">07</div>
    <h2>{t.s07.h2}</h2>
    <p>
      {t.s07.p1a} <strong>{t.s07.p1strong}</strong> {t.s07.p1b}
    </p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>{t.s07.table.provider}</th><th>{t.s07.table.role}</th><th>{t.s07.table.location}</th></tr></thead>
        <tbody>
          <tr><td>Contabo GmbH</td><td>{t.s07.table.row1Role}</td><td>{t.s07.table.row1Location}</td></tr>
          <tr><td>Cloudflare, Inc.</td><td>{t.s07.table.row2Role}</td><td>{t.s07.table.row2Location}</td></tr>
          <tr><td>Discord Inc.</td><td>{t.s07.table.row3Role}</td><td>{t.s07.table.row3Location}</td></tr>
          <tr><td>{t.s07.table.row4Name}</td><td>{t.s07.table.row4Role}</td><td>{t.s07.table.row4Location}</td></tr>
          <tr><td>{t.s07.table.row5Name}</td><td>{t.s07.table.row5Role}</td><td>{t.s07.table.row5Location}</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section id="transferts" class="policy-section">
    <div class="section-badge">08</div>
    <h2>{t.s08.h2}</h2>
    <p>
      {t.s08.p1a} <strong>{t.s08.p1strong}</strong> {t.s08.p1b}
    </p>
  </section>

  <section id="violations" class="policy-section">
    <div class="section-badge">09</div>
    <h2>{t.s09.h2}</h2>
    <p>
      {t.s09.p1a} <strong>{t.s09.p1strong}</strong> {t.s09.p1b}
    </p>
  </section>

  <section id="restitution" class="policy-section">
    <div class="section-badge">10</div>
    <h2>{t.s10.h2}</h2>
    <ul>
      <li>{t.s10.li1a} <strong>{t.s10.li1strong1}</strong> {t.s10.li1b} <strong>{t.s10.li1strong2}</strong>{t.s10.li1c}</li>
      <li>{t.s10.li2a} <strong>{t.s10.li2strong}</strong> {t.s10.li2b}</li>
      <li>{t.s10.li3a} <strong>{t.s10.li3strong1}</strong> {t.s10.li3b} <strong>{t.s10.li3strong2}</strong>{t.s10.li3c}</li>
      <li>{t.s10.li4}</li>
    </ul>
  </section>

  <section id="audits" class="policy-section">
    <div class="section-badge">11</div>
    <h2>{t.s11.h2}</h2>
    <p>
      {t.s11.p1a} <strong>{t.s11.p1strong1}</strong> {t.s11.p1b} <strong>{t.s11.p1strong2}</strong>{t.s11.p1c}
    </p>
  </section>

  <section id="toms" class="policy-section">
    <div class="section-badge">12</div>
    <h2>{t.s12.h2}</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>{t.s12.table.domain}</th><th>{t.s12.table.measures}</th></tr></thead>
        <tbody>
          <tr><td>{t.s12.table.row1Domain}</td><td>{t.s12.table.row1Measures}</td></tr>
          <tr><td>{t.s12.table.row2Domain}</td><td>{t.s12.table.row2Measures}</td></tr>
          <tr><td>{t.s12.table.row3Domain}</td><td>{t.s12.table.row3Measures}</td></tr>
          <tr><td>{t.s12.table.row4Domain}</td><td>{t.s12.table.row4Measures}</td></tr>
          <tr><td>{t.s12.table.row5Domain}</td><td>{t.s12.table.row5Measures}</td></tr>
          <tr><td>{t.s12.table.row6Domain}</td><td>{t.s12.table.row6Measures}</td></tr>
          <tr><td>{t.s12.table.row7Domain}</td><td>{t.s12.table.row7Measures}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="info-box warn">
      {t.s12.warn}
    </div>
  </section>

  <section id="contact" class="policy-section">
    <div class="section-badge">13</div>
    <h2>{t.s13.h2}</h2>
    <p>
      {t.s13.p1a}
      <a href="mailto:privacy@kotbo.fr">privacy@kotbo.fr</a>.
    </p>
    <div class="info-box">
      {t.s13.infoA} <a href="{base}/privacy">{t.s13.infoLink1}</a>{t.s13.infoB} <a href="{base}/terms">{t.s13.infoLink2}</a>{t.s13.infoC}
      <a href="{base}/cookies">{t.s13.infoLink3}</a>{t.s13.infoD} <a href="{base}/mentions-legales">{t.s13.infoLink4}</a> {t.s13.infoE}
      <a href="{base}/admin-notice">{t.s13.infoLink5}</a>{t.s13.infoF}
    </div>
  </section>
</LegalPageLayout>
