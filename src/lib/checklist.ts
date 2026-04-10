/**
 * Employer checklist steps for hiring household staff in Switzerland.
 * Each step includes guidance, canton-specific links where relevant,
 * and varies based on employment type.
 *
 * All links verified April 2026.
 */

export type ChecklistStep = {
  key: string;
  title: string;
  description: string;
  guidance: string;
  links: { label: string; url: string }[];
  employmentTypes?: string[];
  order: number;
};

// Canton compensation fund (Caisse de compensation) URLs — verified April 2026
const CANTON_AVS_LINKS: Record<string, { label: string; url: string }> = {
  VD: { label: "Caisse cantonale vaudoise de compensation AVS", url: "https://www.caisseavsvaud.ch" },
  GE: { label: "OCAS – Office cantonal des assurances sociales (Genève)", url: "https://www.ocas.ch" },
  VS: { label: "Caisse de compensation du Valais", url: "https://www.avsvalais.ch" },
  FR: { label: "Caisse de compensation du canton de Fribourg", url: "https://www.ccf.ch" },
  NE: { label: "Caisse cantonale neuchâteloise de compensation", url: "https://www.caisseavsne.ch" },
  JU: { label: "ECAS – Établissement cantonal des assurances sociales du Jura", url: "https://www.ecasjura.ch" },
  BE: { label: "Ausgleichskasse des Kantons Bern", url: "https://www.akbern.ch" },
  ZH: { label: "SVA Zürich", url: "https://www.svazurich.ch" },
  BS: { label: "Ausgleichskasse Basel-Stadt", url: "https://www.ak-bs.ch" },
  BL: { label: "SVA Basel-Landschaft", url: "https://www.sva-bl.ch" },
  AG: { label: "SVA Aargau", url: "https://www.sva-ag.ch" },
  LU: { label: "Ausgleichskasse Luzern", url: "https://www.ahvluzern.ch" },
  SG: { label: "SVA St. Gallen", url: "https://www.svasg.ch" },
  TI: { label: "IAS – Istituto delle assicurazioni sociali (Ticino)", url: "https://www4.ti.ch/dss/ias/ias" },
  TG: { label: "SVZ Thurgau – Sozialversicherungszentrum", url: "https://www.svztg.ch" },
  SO: { label: "Ausgleichskasse des Kantons Solothurn", url: "https://www.akso.ch" },
  GR: { label: "SVA Graubünden", url: "https://www.sva.gr.ch" },
  SZ: { label: "Ausgleichskasse / IV-Stelle Schwyz", url: "https://www.aksz.ch" },
  ZG: { label: "Ausgleichskasse Zug", url: "https://www.akzug.ch" },
  SH: { label: "SVA Schaffhausen", url: "https://www.svash.ch" },
  NW: { label: "Ausgleichskasse Nidwalden", url: "https://www.aknw.ch" },
  OW: { label: "AKOW – Ausgleichskasse Obwalden", url: "https://www.akow.ch" },
  GL: { label: "SVA Glarus", url: "https://www.svgl.ch" },
  UR: { label: "SVS – Sozialversicherungsstelle Uri", url: "https://www.svsuri.ch" },
  AI: { label: "AKAI – Ausgleichskasse Appenzell Innerrhoden", url: "https://www.akai.ch" },
  AR: { label: "SOVAR – Sozialversicherungen Appenzell Ausserrhoden", url: "https://www.sovar.ch" },
};

// Canton-specific accident insurance (LAA) info
const CANTON_LAA_INFO: Record<string, string> = {
  GE: "À Genève, le Service de l'inspection du travail (OCIRT) peut vous renseigner sur vos obligations LAA.",
  VD: "Dans le canton de Vaud, les employeurs de personnel de maison peuvent contacter la Caisse AVS vaudoise qui oriente vers les assureurs LAA reconnus.",
  TI: "In Ticino, l'IAS può fornire indicazioni sugli assicuratori LAA riconosciuti per il personale domestico.",
};

// Canton-specific withholding tax (impôt à la source) info
const CANTON_TAX_INFO: Record<string, string> = {
  GE: "À Genève, contactez l'Administration fiscale cantonale (AFC-GE) pour les barèmes d'impôt à la source : www.ge.ch/impot-source.",
  VD: "Dans le canton de Vaud, les barèmes sont disponibles auprès de l'Administration cantonale des impôts (ACI) : www.vd.ch/impots.",
  ZH: "Im Kanton Zürich erhalten Sie die Quellensteuer-Tarife beim Kantonalen Steueramt: www.steueramt.zh.ch.",
  BE: "Im Kanton Bern sind die Quellensteuertarife beim Steuerverwaltung Bern erhältlich: www.fin.be.ch.",
  BS: "Im Kanton Basel-Stadt: Steuerverwaltung Basel-Stadt, www.steuerverwaltung.bs.ch.",
  TI: "Nel Canton Ticino, contattare la Divisione delle contribuzioni: www4.ti.ch/dfe/dc.",
};

export function getChecklistSteps(canton: string, employmentType: string): ChecklistStep[] {
  const cantonAvsLink = CANTON_AVS_LINKS[canton];
  const cantonTaxInfo = CANTON_TAX_INFO[canton] || `Renseignez-vous auprès de l'administration fiscale de votre canton (${canton}) pour connaître les barèmes applicables.`;
  const cantonLaaInfo = CANTON_LAA_INFO[canton] || "";

  const steps: ChecklistStep[] = [
    {
      key: "register_avs",
      title: "S'inscrire à la caisse de compensation (AVS)",
      description: "En tant qu'employeur, vous devez vous affilier à une caisse de compensation AVS de votre canton.",
      guidance: `Contactez la caisse de compensation de votre canton (${canton}) pour vous inscrire en tant qu'employeur de personnel de maison. Vous recevrez un numéro d'affilié. Cette démarche est obligatoire dès le premier franc de salaire versé.\n\nMunissez-vous de :\n• Votre pièce d'identité\n• Les coordonnées de votre employé(e)\n• Le numéro AVS de l'employé(e) (756.XXXX.XXXX.XX)`,
      links: [
        ...(cantonAvsLink ? [cantonAvsLink] : []),
        { label: "Informations AVS – ch.ch", url: "https://www.ch.ch/fr/avs/" },
        { label: "Guide employeur – KMU Admin", url: "https://www.kmu.admin.ch/kmu/fr/home/savoir-pratique/personnel/gestion-personnel/obligations-employeur/assurances-sociales.html" },
      ],
      order: 1,
    },
    {
      key: "declare_employee",
      title: "Déclarer votre employé(e) auprès de la caisse AVS",
      description: "Annoncez l'engagement de votre employé(e) à la caisse de compensation.",
      guidance: `Déclarez votre employé(e) auprès de la caisse de compensation de votre canton (${canton}) avec :\n• Son numéro AVS (756.XXXX.XXXX.XX)\n• Sa date de naissance\n• Son salaire brut convenu\n• Son taux d'occupation\n\nLa caisse calculera les cotisations dues. Taux employé : AVS/AI/APG 5.3%, AC 1.1%. L'employeur paie la même part.`,
      links: [
        ...(cantonAvsLink ? [cantonAvsLink] : []),
        { label: "Cotisations AVS/AI/APG en détail", url: "https://www.ahv-iv.ch/fr/Assurances-sociales/Assurance-vieillesse-et-survivants-AVS/Cotisations-AVS-AI-APG" },
      ],
      order: 2,
    },
    {
      key: "contract",
      title: "Rédiger un contrat de travail",
      description: "Un contrat écrit n'est pas obligatoire mais fortement recommandé pour éviter les litiges.",
      guidance: `Le contrat doit mentionner :\n• Les parties (employeur et employé)\n• La fonction et le taux d'occupation\n• L'horaire de travail (jours et heures)\n• Le salaire brut (avec ou sans vacances incluses)\n• La date de début\n• Le délai de résiliation\n• Les vacances (minimum 4 semaines, 5 semaines si < 20 ans)\n\nVérifiez si un contrat-type de travail (CTT) existe dans votre canton (${canton}) pour le travail domestique — il fixe des conditions minimales obligatoires.\n\n💡 Utilisez le générateur de contrats HappySalary dans votre dashboard pour créer un contrat conforme automatiquement.`,
      links: [
        { label: "Contrats-types cantonaux (SECO)", url: "https://www.seco.admin.ch/seco/fr/home/Arbeit/Personenfreizugigkeit_Arbeitsbeziehungen/normalarbeitsvertraege.html" },
        { label: "Contrat-type de travail – ch.ch", url: "https://www.ch.ch/fr/contrat-travail/" },
      ],
      order: 3,
    },
    {
      key: "accident_insurance",
      title: "Souscrire l'assurance accidents (LAA)",
      description: "L'assurance accidents est obligatoire dès 8 heures de travail par semaine.",
      guidance: `Règles LAA pour le personnel de maison :\n\n• ≥ 8h/semaine chez vous → Assurance accidents professionnels ET non professionnels obligatoire\n• < 8h/semaine → Seuls les accidents professionnels sont couverts par votre assurance\n\nContactez un assureur LAA reconnu :\n• SUVA (assureur de référence)\n• Zurich Assurance\n• AXA\n• La Mobilière\n• Helvetia\n• Baloise${cantonLaaInfo ? `\n\n${cantonLaaInfo}` : ""}`,
      links: [
        { label: "SUVA – Assurance accidents", url: "https://www.suva.ch/fr-ch" },
        { label: "Info LAA – ch.ch", url: "https://www.ch.ch/fr/travail/maladie--accident--invalidite/assurance-accidents/" },
      ],
      order: 4,
    },
    {
      key: "salary_calculation",
      title: "Calculer le salaire net et les déductions",
      description: "Calculez le salaire net après déduction des cotisations sociales.",
      guidance: `Déductions sur le salaire brut de l'employé(e) :\n• AVS/AI/APG : 5.3%\n• AC (chômage) : 1.1%\n• AANP (accidents non prof.) : ~1.28%\n\nCharges employeur (en plus du brut) :\n• AVS/AI/APG : 5.3%\n• AC : 1.1%\n• AAP (accidents prof.) : ~0.17%\n• Allocations familiales : variable selon le canton (${canton})\n• Frais d'administration : ~1.5%\n\n💡 Le générateur de fiches de salaire HappySalary calcule tout automatiquement avec les taux de votre canton.`,
      links: [
        { label: "Taux de cotisation AVS actuels", url: "https://www.ahv-iv.ch/fr/Assurances-sociales/Assurance-vieillesse-et-survivants-AVS/Cotisations-AVS-AI-APG" },
      ],
      order: 5,
    },
    {
      key: "payslip",
      title: "Établir la fiche de salaire mensuelle",
      description: "Remettez chaque mois une fiche de salaire détaillée à votre employé(e).",
      guidance: `La fiche de salaire doit contenir :\n• Le salaire brut\n• Chaque déduction détaillée (AVS, AI, APG, AC, LAA)\n• Le supplément vacances si applicable (8.33% pour 4 semaines, 10.64% pour 5 semaines)\n• Le salaire net\n• La période concernée\n• Les éventuelles heures supplémentaires\n\nConservez un double pour vos archives. Ce document est nécessaire pour la déclaration d'impôts de votre employé(e).\n\n💡 Utilisez le générateur de fiches de salaire HappySalary pour créer et archiver automatiquement vos fiches.`,
      links: [],
      order: 6,
    },
    {
      key: "withholding_tax",
      title: "Vérifier l'impôt à la source",
      description: "Les employés étrangers sans permis C sont soumis à l'impôt à la source.",
      guidance: `Si votre employé(e) est de nationalité étrangère et ne possède pas de permis d'établissement (permis C), vous devez prélever l'impôt à la source sur son salaire.\n\nLe taux dépend de :\n• Le canton de résidence de l'employé(e)\n• Son état civil\n• Ses revenus\n\n${cantonTaxInfo}\n\n💡 La procédure simplifiée (art. 37a LAVS) inclut un impôt forfaitaire de 5% — applicable si le salaire ne dépasse pas CHF 22'050/an par employeur. Activable dans le générateur de fiches de salaire HappySalary.`,
      links: [
        { label: "Impôt à la source – ch.ch", url: "https://www.ch.ch/fr/etrangers-en-suisse/vivre-en-suisse/imposition-a-la-source/" },
      ],
      order: 7,
    },
    {
      key: "annual_declaration",
      title: "Effectuer la déclaration annuelle de salaires",
      description: "Chaque année en janvier, déclarez les salaires versés à la caisse de compensation.",
      guidance: `Avant le 30 janvier de chaque année :\n\n1. Déclarez à votre caisse de compensation (${canton}) le total des salaires bruts versés l'année précédente\n2. La caisse établira le décompte définitif des cotisations\n3. Vous recevrez une facture pour le solde ou un remboursement\n\n⚠️ Conservez les fiches de salaire et justificatifs pendant 10 ans minimum (obligation légale).`,
      links: [
        ...(cantonAvsLink ? [cantonAvsLink] : []),
        { label: "Obligations AVS – ch.ch", url: "https://www.ch.ch/fr/avs/" },
      ],
      order: 8,
    },
    {
      key: "certificate_of_salary",
      title: "Remettre le certificat de salaire annuel",
      description: "Établissez un certificat de salaire pour la déclaration d'impôts de votre employé(e).",
      guidance: `Chaque année (avant fin février), remettez à votre employé(e) un certificat de salaire récapitulant :\n• Les montants bruts et nets versés\n• Les cotisations retenues\n• Les éventuels avantages en nature\n\nUtilisez le formulaire officiel de l'Administration fédérale des contributions (AFC). Ce document est indispensable pour la déclaration d'impôts de votre employé(e).`,
      links: [
        { label: "Certificat de salaire – AFC", url: "https://www.estv.admin.ch/fr/certificat-de-salaire-et-attestation-de-rentes" },
      ],
      order: 9,
    },
  ];

  // Add au-pair specific step
  if (employmentType === "au_pair") {
    steps.push({
      key: "au_pair_permit",
      title: "Obtenir le permis de travail pour l'au pair",
      description: "Un permis de travail est nécessaire pour les au pairs non-européens.",
      guidance: `Règles pour l'engagement d'un(e) au pair :\n\n• UE/AELE : simple annonce en ligne auprès de l'Office cantonal de la population\n• Hors UE/AELE : permis de travail cantonal obligatoire\n\nConditions :\n• Âge : 18 à 25 ans (parfois 30 selon le canton)\n• Durée max : 1 an (non renouvelable)\n• Heures de travail : max 30h/semaine\n• L'au pair doit suivre des cours de langue\n\nContactez l'Office de la population de votre canton (${canton}).`,
      links: [
        { label: "Travailler en Suisse – ch.ch", url: "https://www.ch.ch/fr/etrangers-en-suisse/travailler-en-suisse/" },
      ],
      order: 2.5,
    });
  }

  // Add elderly care specific step
  if (employmentType === "elderly_care") {
    steps.push({
      key: "spitex_coordination",
      title: "Coordonner avec les services Spitex si nécessaire",
      description: "Si votre proche reçoit déjà des soins à domicile, coordonnez les prestations.",
      guidance: `Si votre proche bénéficie de prestations Spitex ou de soins infirmiers à domicile :\n\n1. Informez le service Spitex de l'engagement d'une aide supplémentaire\n2. Délimitez clairement les tâches (aide ménagère vs soins médicaux)\n3. Vérifiez l'éligibilité aux prestations complémentaires (PC) de l'AVS/AI — elles peuvent couvrir une partie des frais d'aide à domicile\n\nRenseignez-vous auprès de votre caisse de compensation (${canton}).`,
      links: [
        { label: "Spitex Suisse", url: "https://www.spitex.ch/fr" },
        { label: "Prestations complémentaires AVS/AI", url: "https://www.ahv-iv.ch/fr/Assurances-sociales/Prestations-complementaires" },
      ],
      order: 2.5,
    });
  }

  return steps.sort((a, b) => a.order - b.order);
}
