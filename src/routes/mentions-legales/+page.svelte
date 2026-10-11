<script lang="ts">
  import Seo from '$lib/seo/Seo.svelte';
  /**
   * Mentions légales.
   *
   * Cette page déclarait jusqu'ici une édition « par des particuliers à titre
   * non professionnel », sans SIREN, en s'appuyant sur l'option de l'article
   * 6 III 2 de la LCEN qui dispense les éditeurs non professionnels de publier
   * leur adresse.
   *
   * Cette construction ne tient plus : Kotbo vend des abonnements récurrents
   * encaissés par Stripe. Une activité de vente répétée et lucrative est une
   * activité professionnelle, l'option de la LCEN ne lui est pas ouverte, et un
   * vendeur à distance doit publier son identité complète (art. L221-5 du code
   * de la consommation, R123-237 du code de commerce). Les mentions décrivent
   * donc désormais la micro-entreprise qui exploite le service.
   */
  import { base } from '$app/paths';
  import LegalPageLayout from '$lib/components/LegalPageLayout.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';

  const TEXT = {
    fr: {
      title: 'Mentions légales',
      subtitle: 'Dernière mise à jour : 5 septembre 2026',
      metaDescription: "Mentions légales du service Kotbo : éditeur, immatriculation, directeur de publication, hébergeur et contact.",
      sections: {
        editeur: "Éditeur du site",
        directeur: 'Directeur de publication',
        hebergeur: 'Hébergeur',
        contact: 'Contact',
        conditions: 'Conditions contractuelles',
        pi: 'Propriété intellectuelle',
      },
      danger: {
        title: 'À compléter avant publication',
        body1: "L'adresse professionnelle marquée",
        code: '[À COMPLÉTER]',
        body2a: "ci-dessous est une mention obligatoire pour un vendeur à distance",
        body2b: " : la page ne doit pas être mise en ligne tant qu'elle manque. Le numéro de TVA indiqué découle du SIREN et doit être vérifié sur l'attestation d'assujettissement.",
      },
      s01: {
        h2: 'Éditeur du site et du service',
        p1: "Le service Kotbo — bot Discord, tableau de bord et site — est édité et exploité par une entreprise individuelle relevant du régime de la micro-entreprise :",
        table: {
          info: 'Information',
          value: 'Valeur',
          denomination: 'Dénomination',
          denominationValue: "[À COMPLÉTER : nom de l'entrepreneur individuel]",
          forme: 'Forme juridique',
          formeValue: 'Entreprise individuelle — régime de la micro-entreprise',
          siren: 'SIREN',
          siret: 'SIRET (siège)',
          tva: 'N° de TVA intracommunautaire',
          adresse: 'Adresse professionnelle',
          adresseValue: '[À COMPLÉTER]',
          email: 'E-mail',
        },
        p2a: 'Le service est conçu et développé par',
        p2b: 'et',
        p2c: '.',
        p3a: "Les conditions commerciales de la vente des abonnements figurent dans les",
        p3link: 'Conditions Générales de Vente',
        p3b: ', qui reprennent cette même identité.',
      },
      s02: {
        h2: 'Directeur de la publication',
        p1a: 'Les directeurs de la publication sont',
        p1b: 'et',
        p1c: '.',
      },
      s03: {
        h2: 'Hébergeur',
        p1: "Le site et l'infrastructure sont hébergés par :",
        table: {
          role: 'Rôle',
          provider: 'Prestataire',
          cdnRole: 'Distribution du site / CDN & sécurité',
          cdnValue: 'Cloudflare, Inc. — 101 Townsend St, San Francisco, CA 94107, États-Unis',
          dbRole: "Hébergement de la base de données et de l'infrastructure applicative",
          dbValue: 'Contabo GmbH — Aschauer Straße 32a, 81549 Munich, Allemagne (Union européenne) ·',
          paymentRole: 'Traitement des paiements',
          paymentValue: '1 Grand Canal Street Lower, Dublin 2, Irlande (Union européenne) ·',
        },
        p2a: 'La localisation et les garanties de ces prestataires sont détaillées dans l\'',
        p2link1: 'accord de sous-traitance',
        p2b: 'et la',
        p2link2: 'politique de confidentialité',
        p2c: '.',
      },
      s04: {
        h2: 'Contact',
        li1a: 'Contact général et commercial',
        li2a: 'Données personnelles & vie privée',
        li3a: 'Rendez-vous commercial',
      },
      s05: {
        h2: 'Conditions contractuelles',
        p1: "Plusieurs documents distincts régissent la relation, selon ce dont il est question :",
        li1link: "Conditions Générales d'Utilisation",
        li1: "— ce que l'on peut faire avec le service, et à quelles obligations son usage est soumis.",
        li2link: 'Conditions Générales de Vente',
        li2: '— offres, prix, TVA, essai, reconduction, résiliation, rétractation et garanties.',
        li3linka: 'Politique de confidentialité',
        li3and: 'et',
        li3linkb: 'accord de sous-traitance',
        li3: '— le traitement des données personnelles.',
        p2a: 'Le',
        p2link: 'détail des cookies et stockages locaux',
        p2b: 'employés par le site et le tableau de bord est publié séparément.',
      },
      s06: {
        h2: 'Propriété intellectuelle',
        p1a: "L'ensemble des éléments du service (nom, logos, interface, code) est protégé. Toute reproduction ou réutilisation non autorisée est interdite. Voir les",
        p1link: 'CGU',
        p1b: "pour les conditions d'utilisation.",
      },
    },
    en: {
      title: 'Legal Notice',
      subtitle: 'Last updated: September 5, 2026',
      metaDescription: 'Legal notice for the Kotbo service: publisher, registration, publication director, host, and contact.',
      sections: {
        editeur: 'Website publisher',
        directeur: 'Publication director',
        hebergeur: 'Hosting',
        contact: 'Contact',
        conditions: 'Contractual terms',
        pi: 'Intellectual property',
      },
      danger: {
        title: 'To be completed before publication',
        body1: 'The business address marked',
        code: '[TO BE COMPLETED]',
        body2a: "below is a mandatory disclosure for a distance seller",
        body2b: " : the page must not be published until it is filled in. The VAT number shown is derived from the SIREN number and must be verified against the tax registration certificate.",
      },
      s01: {
        h2: 'Publisher of the website and service',
        p1: "The Kotbo service — Discord bot, dashboard, and website — is published and operated by a sole proprietorship under the French micro-entreprise regime :",
        table: {
          info: 'Information',
          value: 'Value',
          denomination: 'Business name',
          denominationValue: '[TO BE COMPLETED: name of the sole trader]',
          forme: 'Legal form',
          formeValue: 'Sole proprietorship — micro-entreprise regime',
          siren: 'SIREN',
          siret: 'SIRET (registered office)',
          tva: 'Intra-Community VAT number',
          adresse: 'Business address',
          adresseValue: '[TO BE COMPLETED]',
          email: 'Email',
        },
        p2a: 'The service is designed and developed by',
        p2b: 'and',
        p2c: '.',
        p3a: 'The commercial terms for the sale of subscriptions are set out in the',
        p3link: 'Terms of Sale',
        p3b: ', which use this same identity.',
      },
      s02: {
        h2: 'Publication director',
        p1a: 'The publication directors are',
        p1b: 'and',
        p1c: '.',
      },
      s03: {
        h2: 'Hosting',
        p1: 'The website and infrastructure are hosted by :',
        table: {
          role: 'Role',
          provider: 'Provider',
          cdnRole: 'Website delivery / CDN & security',
          cdnValue: 'Cloudflare, Inc. — 101 Townsend St, San Francisco, CA 94107, United States',
          dbRole: 'Database and application infrastructure hosting',
          dbValue: 'Contabo GmbH — Aschauer Straße 32a, 81549 Munich, Germany (European Union) ·',
          paymentRole: 'Payment processing',
          paymentValue: '1 Grand Canal Street Lower, Dublin 2, Ireland (European Union) ·',
        },
        p2a: 'The location and guarantees of these providers are detailed in the',
        p2link1: 'data processing agreement',
        p2b: 'and the',
        p2link2: 'privacy policy',
        p2c: '.',
      },
      s04: {
        h2: 'Contact',
        li1a: 'General and sales contact',
        li2a: 'Personal data & privacy',
        li3a: 'Sales appointment',
      },
      s05: {
        h2: 'Contractual terms',
        p1: 'Several distinct documents govern the relationship, depending on the matter at hand :',
        li1link: 'Terms of Use',
        li1: '— what you may do with the service, and what obligations its use is subject to.',
        li2link: 'Terms of Sale',
        li2: '— offers, pricing, VAT, trial, renewal, termination, withdrawal, and warranties.',
        li3linka: 'Privacy Policy',
        li3and: 'and',
        li3linkb: 'data processing agreement',
        li3: '— the processing of personal data.',
        p2a: 'The',
        p2link: 'details of cookies and local storage',
        p2b: 'used by the website and dashboard are published separately.',
      },
      s06: {
        h2: 'Intellectual property',
        p1a: 'All elements of the service (name, logos, interface, code) are protected. Any unauthorized reproduction or reuse is prohibited. See the',
        p1link: 'Terms of Use',
        p1b: 'for the conditions of use.',
      },
    },
  };

  const t = $derived(TEXT[getLocale()]);

  const sections = $derived([
    { id: 'editeur',   label: t.sections.editeur },
    { id: 'directeur', label: t.sections.directeur },
    { id: 'hebergeur', label: t.sections.hebergeur },
    { id: 'contact',   label: t.sections.contact },
    { id: 'conditions',label: t.sections.conditions },
    { id: 'pi',        label: t.sections.pi },
  ]);
</script>

<Seo title="Mentions légales | Kotbo" description={t.metaDescription} path="/mentions-legales" />

<LegalPageLayout
  title={t.title}
  subtitle={t.subtitle}
  {sections}
  activePage="legal"
>
  <div class="info-box danger mb-10">
    <p class="font-bold mb-1">{t.danger.title}</p>
    <p class="mb-0">
      {t.danger.body1} <code>{t.danger.code}</code> {t.danger.body2a}{t.danger.body2b}
    </p>
  </div>

  <section id="editeur" class="policy-section">
    <div class="section-badge">01</div>
    <h2>{t.s01.h2}</h2>
    <p>
      {t.s01.p1}
    </p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>{t.s01.table.info}</th><th>{t.s01.table.value}</th></tr></thead>
        <tbody>
          <tr><td>{t.s01.table.denomination}</td><td><code>{t.s01.table.denominationValue}</code></td></tr>
          <tr><td>{t.s01.table.forme}</td><td>{t.s01.table.formeValue}</td></tr>
          <tr><td>{t.s01.table.siren}</td><td>101&nbsp;303&nbsp;535</td></tr>
          <tr><td>{t.s01.table.siret}</td><td>101&nbsp;303&nbsp;535&nbsp;00021</td></tr>
          <tr><td>{t.s01.table.tva}</td><td>FR&nbsp;14&nbsp;101303535</td></tr>
          <tr><td>{t.s01.table.adresse}</td><td><code>{t.s01.table.adresseValue}</code></td></tr>
          <tr><td>{t.s01.table.email}</td><td><a href="mailto:contact@kotbo.fr">contact@kotbo.fr</a></td></tr>
        </tbody>
      </table>
    </div>
    <p>
      {t.s01.p2a} <strong>Elouan Passereau</strong>
      (<a href="https://klaynight.fr/" target="_blank" rel="noopener noreferrer">klaynight.fr</a>) {t.s01.p2b}
      <strong>Nathan Rontey</strong>
      (<a href="https://nathaan.me/" target="_blank" rel="noopener noreferrer">nathaan.me</a>){t.s01.p2c}
    </p>
    <p class="text-sm text-gray-500">
      {t.s01.p3a}
      <a href="{base}/cgv">{t.s01.p3link}</a>{t.s01.p3b}
    </p>
  </section>

  <section id="directeur" class="policy-section">
    <div class="section-badge">02</div>
    <h2>{t.s02.h2}</h2>
    <p>{t.s02.p1a} <strong>Elouan Passereau</strong> {t.s02.p1b} <strong>Nathan Rontey</strong>{t.s02.p1c}</p>
  </section>

  <section id="hebergeur" class="policy-section">
    <div class="section-badge">03</div>
    <h2>{t.s03.h2}</h2>
    <p>{t.s03.p1}</p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>{t.s03.table.role}</th><th>{t.s03.table.provider}</th></tr></thead>
        <tbody>
          <tr><td>{t.s03.table.cdnRole}</td><td>{t.s03.table.cdnValue}</td></tr>
          <tr><td>{t.s03.table.dbRole}</td><td>{t.s03.table.dbValue} <a href="https://contabo.com" target="_blank" rel="noopener noreferrer">contabo.com</a></td></tr>
          <tr><td>{t.s03.table.paymentRole}</td><td>Stripe Payments Europe, Ltd. — {t.s03.table.paymentValue} <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">stripe.com</a></td></tr>
        </tbody>
      </table>
    </div>
    <p class="text-sm">{t.s03.p2a} <a href="{base}/dpa">{t.s03.p2link1}</a> {t.s03.p2b} <a href="{base}/privacy">{t.s03.p2link2}</a>{t.s03.p2c}</p>
  </section>

  <section id="contact" class="policy-section">
    <div class="section-badge">04</div>
    <h2>{t.s04.h2}</h2>
    <ul>
      <li>{t.s04.li1a}&nbsp;: <a href="mailto:contact@kotbo.fr">contact@kotbo.fr</a></li>
      <li>{t.s04.li2a}&nbsp;: <a href="mailto:privacy@kotbo.fr">privacy@kotbo.fr</a></li>
      <li>{t.s04.li3a}&nbsp;: <a href="https://pros.kotbo.fr/rdv" target="_blank" rel="noopener noreferrer">pros.kotbo.fr/rdv</a></li>
    </ul>
  </section>

  <section id="conditions" class="policy-section">
    <div class="section-badge">05</div>
    <h2>{t.s05.h2}</h2>
    <p>{t.s05.p1}</p>
    <ul>
      <li><a href="{base}/terms">{t.s05.li1link}</a> {t.s05.li1}</li>
      <li><a href="{base}/cgv">{t.s05.li2link}</a> {t.s05.li2}</li>
      <li><a href="{base}/privacy">{t.s05.li3linka}</a> {t.s05.li3and} <a href="{base}/dpa">{t.s05.li3linkb}</a> {t.s05.li3}</li>
    </ul>
    <p>
      {t.s05.p2a} <a href="{base}/cookies">{t.s05.p2link}</a>
      {t.s05.p2b}
    </p>
  </section>

  <section id="pi" class="policy-section">
    <div class="section-badge">06</div>
    <h2>{t.s06.h2}</h2>
    <p>
      {t.s06.p1a} <a href="{base}/terms">{t.s06.p1link}</a> {t.s06.p1b}
    </p>
  </section>
</LegalPageLayout>
