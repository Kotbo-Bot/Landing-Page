<script lang="ts">
  import Seo from '$lib/seo/Seo.svelte';
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';

  const TEXT = {
    fr: {
      pageTitle: "Modèle d'information des membres | Kotbo",
      metaDescription:
        "Modèle de texte à publier sur ton serveur Discord pour informer les membres des données que Kotbo traite, selon les modules activés.",
      back: '← Retour à Kotbo',
      h1: "Modèle d'information des membres",
      intro: "Ce modèle doit être adapté aux modules réellement activés, aux durées retenues par le serveur et à l'identité de son administrateur.",
      template: {
        h2: 'Utilisation du bot Kotbo',
        p1: '[Nom du serveur / responsable] utilise Kotbo pour : [modules et finalités activés].',
        p2a: 'Selon ces modules, Kotbo peut traiter votre identifiant et profil Discord, votre activité sur le serveur, vos participations, tickets, candidatures ou informations de modération. [Nom du serveur] est responsable de ces traitements et Kotbo intervient comme prestataire sous-traitant.',
        p3: "La base légale retenue est : [intérêt légitime / contrat / consentement selon la finalité]. Les données sont accessibles à [rôles autorisés] et conservées pendant [durées].",
        p4a: "Vous pouvez demander l'accès, la rectification, la limitation, l'opposition ou l'effacement de vos données auprès de [contact du serveur]. Vous pouvez également contacter privacy@kotbo.fr ou saisir la CNIL.",
        p5: 'Politique complète : https://kotbo.fr/privacy',
      },
      requiredTitle: 'Points à compléter obligatoirement',
      required: [
        'identité et contact du responsable du serveur ;',
        'finalités, modules et bases légales ;',
        'destinataires et durées ;',
        "modalités concrètes d'exercice des droits.",
      ],
      footer: {
        privacy: 'Confidentialité',
        terms: 'CGU',
        dpa: 'DPA',
        legal: 'Mentions légales',
      },
    },
    en: {
      pageTitle: 'Member Information Template | Kotbo',
      metaDescription:
        'Template to post on your Discord server so members know which data Kotbo processes, depending on the modules you enabled.',
      back: '← Back to Kotbo',
      h1: 'Member information template',
      intro: 'This template must be adapted to the modules actually enabled, the retention periods chosen by the server, and the identity of its administrator.',
      template: {
        h2: 'Use of the Kotbo bot',
        p1: '[Server name / administrator] uses Kotbo for: [enabled modules and purposes].',
        p2a: "Depending on these modules, Kotbo may process your Discord identifier and profile, your activity on the server, your participations, tickets, applications, or moderation information. [Server name] is the data controller for these processing activities, and Kotbo acts as a data processor.",
        p3: 'The legal basis relied upon is: [legitimate interest / contract / consent, depending on the purpose]. The data is accessible to [authorized roles] and retained for [durations].',
        p4a: 'You may request access, rectification, restriction, objection, or erasure of your data from [server contact]. You may also contact privacy@kotbo.fr or lodge a complaint with the CNIL.',
        p5: 'Full policy: https://kotbo.fr/privacy',
      },
      requiredTitle: 'Points that must be completed',
      required: [
        "the identity and contact details of the server administrator;",
        'the purposes, modules, and legal bases;',
        'the recipients and retention periods;',
        'the concrete arrangements for exercising rights.',
      ],
      footer: {
        privacy: 'Privacy',
        terms: 'Terms of Use',
        dpa: 'DPA',
        legal: 'Legal Notice',
      },
    },
  };

  const t = $derived(TEXT[getLocale()]);
</script>

<Seo title={t.pageTitle} description={t.metaDescription} path="/admin-notice" />

<main class="min-h-screen bg-gray-50 text-gray-800 py-14 px-6">
  <article class="max-w-3xl mx-auto bg-white border border-gray-200 rounded-3xl p-7 md:p-12 shadow-sm prose-legal">
    <a href="{base}/" class="text-sm font-bold text-indigo-700 hover:underline">{t.back}</a>
    <h1>{t.h1}</h1>
    <p>{t.intro}</p>
    <div class="template">
      <h2>{t.template.h2}</h2>
      <p>{t.template.p1}</p>
      <p>{t.template.p2a}</p>
      <p>{t.template.p3}</p>
      <p>{t.template.p4a}</p>
      <p>{t.template.p5}</p>
    </div>
    <h2>{t.requiredTitle}</h2>
    <ul>{#each t.required as item}<li>{item}</li>{/each}</ul>
    <footer><a href="{base}/privacy">{t.footer.privacy}</a><a href="{base}/terms">{t.footer.terms}</a><a href="{base}/dpa">{t.footer.dpa}</a><a href="{base}/mentions-legales">{t.footer.legal}</a></footer>
  </article>
</main>

<style>
  .prose-legal{line-height:1.75}.prose-legal h1{font:800 2.3rem Manrope,sans-serif;margin:1.5rem 0;color:#111827}.prose-legal h2{font:800 1.3rem Manrope,sans-serif;margin:2rem 0 .5rem}.template{margin:2rem 0;padding:1.5rem;border:1px solid #c7d2fe;background:#f5f7ff;border-radius:1rem}.template h2{margin-top:0}ul{padding-left:1.4rem;list-style:disc}footer{display:flex;gap:1.25rem;margin-top:3rem;padding-top:1.5rem;border-top:1px solid #e5e7eb;font-weight:700;color:#4338ca}
</style>
