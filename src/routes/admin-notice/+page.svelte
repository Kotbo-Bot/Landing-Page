<script lang="ts">
  /**
   * Le modèle de texte qu'un serveur publie pour informer ses membres des
   * données que Kotbo traite (lié depuis la politique de confidentialité et
   * le DPA). Même gabarit que les pages légales, sans sommaire.
   */
  import Seo from '$lib/seo/Seo.svelte';
  import LegalPageLayout from '$lib/components/LegalPageLayout.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';

  const TEXT = {
    fr: {
      pageTitle: "Modèle d'information des membres | Kotbo",
      metaDescription:
        "Modèle de texte à publier sur ton serveur Discord pour informer les membres des données que Kotbo traite, selon les modules activés.",
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
    },
    en: {
      pageTitle: 'Member Information Template | Kotbo',
      metaDescription:
        'Template to post on your Discord server so members know which data Kotbo processes, depending on the modules you enabled.',
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
    },
  };

  const t = $derived(TEXT[getLocale()]);
</script>

<Seo title={t.pageTitle} description={t.metaDescription} path="/admin-notice" />

<LegalPageLayout title={t.h1}>
  <p>{t.intro}</p>
  <div class="info-box my-8">
    <h2>{t.template.h2}</h2>
    <p>{t.template.p1}</p>
    <p>{t.template.p2a}</p>
    <p>{t.template.p3}</p>
    <p>{t.template.p4a}</p>
    <p>{t.template.p5}</p>
  </div>
  <h2>{t.requiredTitle}</h2>
  <ul>{#each t.required as item (item)}<li>{item}</li>{/each}</ul>
</LegalPageLayout>
