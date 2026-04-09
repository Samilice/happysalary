/**
 * Employer checklist steps for hiring household staff in Switzerland.
 * Each step includes guidance, canton-specific links where relevant,
 * and varies based on employment type.
 */

export type ChecklistStep = {
  key: string;
  title: string;
  description: string;
  guidance: string;
  links: { label: string; url: string }[];
  cantonLinks?: Record<string, { label: string; url: string }[]>;
  employmentTypes?: string[]; // if set, only show for these types. null = show for all
  order: number;
};

// Canton compensation fund (Caisse de compensation) URLs
const CANTON_AVS_LINKS: Record<string, { label: string; url: string }> = {
  VD: { label: "Caisse cantonale vaudoise de compensation AVS", url: "https://www.caisseavsvaud.ch" },
  GE: { label: "Caisse cantonale genevoise de compensation", url: "https://www.ccgc.ch" },
  VS: { label: "Caisse de compensation du Valais", url: "https://www.ccvs.ch" },
  FR: { label: "Caisse de compensation du canton de Fribourg", url: "https://www.ccf.ch" },
  NE: { label: "Caisse de compensation du canton de Neuchâtel", url: "https://www.ccne.ch" },
  JU: { label: "Caisse de compensation du canton du Jura", url: "https://www.caisseavs.ju.ch" },
  BE: { label: "Ausgleichskasse des Kantons Bern", url: "https://www.akbern.ch" },
  ZH: { label: "SVA Zürich", url: "https://www.svazurich.ch" },
  BS: { label: "Ausgleichskasse Basel-Stadt", url: "https://www.ak-bs.ch" },
  BL: { label: "Ausgleichskasse Basel-Landschaft", url: "https://www.ak-bl.ch" },
  AG: { label: "SVA Aargau", url: "https://www.sva-ag.ch" },
  LU: { label: "Ausgleichskasse Luzern", url: "https://www.ahvluzern.ch" },
  SG: { label: "SVA St. Gallen", url: "https://www.svasg.ch" },
  TI: { label: "Istituto delle assicurazioni sociali del Cantone Ticino", url: "https://www.iasticino.ch" },
  TG: { label: "SVA Thurgau", url: "https://www.svatlg.ch" },
  SO: { label: "Ausgleichskasse des Kantons Solothurn", url: "https://www.akso.ch" },
  GR: { label: "SVA Graubünden", url: "https://www.sva.gr.ch" },
  SZ: { label: "Ausgleichskasse / IV-Stelle Schwyz", url: "https://www.aksz.ch" },
  ZG: { label: "Ausgleichskasse Zug", url: "https://www.akzug.ch" },
  SH: { label: "SVA Schaffhausen", url: "https://www.svash.ch" },
  NW: { label: "Ausgleichskasse Nidwalden", url: "https://www.aknw.ch" },
  OW: { label: "Ausgleichskasse Obwalden", url: "https://www.akowsvow.ch" },
  GL: { label: "SVA Glarus", url: "https://www.svgl.ch" },
  UR: { label: "Ausgleichskasse Uri", url: "https://www.ur.ch/ahv" },
  AI: { label: "SVA Appenzell Innerrhoden", url: "https://www.ai.ch/ahv" },
  AR: { label: "SVA Appenzell Ausserrhoden", url: "https://www.sva-ar.ch" },
};

export function getChecklistSteps(canton: string, employmentType: string): ChecklistStep[] {
  const cantonAvsLink = CANTON_AVS_LINKS[canton];

  const steps: ChecklistStep[] = [
    {
      key: "register_avs",
      title: "S'inscrire à la caisse de compensation (AVS)",
      description: "En tant qu'employeur, vous devez vous affilier à une caisse de compensation AVS de votre canton.",
      guidance: `Contactez la caisse de compensation de votre canton (${canton}) pour vous inscrire en tant qu'employeur de personnel de maison. Vous recevrez un numéro d'affilié. Cette démarche est obligatoire dès le premier franc de salaire versé. Munissez-vous de votre pièce d'identité et des coordonnées de votre employé(e).`,
      links: [
        ...(cantonAvsLink ? [cantonAvsLink] : []),
        { label: "Informations AVS sur ch.ch", url: "https://www.ch.ch/fr/travail/assurances-sociales/avs/" },
        { label: "Guide employeur KMU Admin", url: "https://www.kmu.admin.ch/kmu/fr/home/savoir-pratique/personnel/droit-du-travail/obligations-sociales-employeurs.html" },
      ],
      order: 1,
    },
    {
      key: "declare_employee",
      title: "Déclarer votre employé(e) auprès de la caisse AVS",
      description: "Annoncez l'engagement de votre employé(e) à la caisse de compensation.",
      guidance: "Une fois affilié, déclarez votre employé(e) avec son numéro AVS (756.XXXX.XXXX.XX), sa date de naissance, son salaire brut convenu et son taux d'occupation. La caisse calculera les cotisations dues (AVS/AI/APG/AC). Les taux employeur sont d'environ 6.4% du salaire brut.",
      links: [
        ...(cantonAvsLink ? [cantonAvsLink] : []),
        { label: "Cotisations AVS en détail", url: "https://www.ahv-iv.ch/fr/Assurances-sociales/Assurance-vieillesse-et-survivants-AVS/Cotisations-AVS-AI-APG" },
      ],
      order: 2,
    },
    {
      key: "contract",
      title: "Rédiger un contrat de travail",
      description: "Un contrat écrit n'est pas obligatoire mais fortement recommandé pour éviter les litiges.",
      guidance: "Le contrat doit mentionner : les parties, la fonction, le taux d'occupation, l'horaire de travail, le salaire brut (avec ou sans vacances incluses), la date de début, le délai de résiliation et les vacances. Vérifiez si un contrat-type de travail (CTT) existe dans votre canton pour le travail domestique — il fixe des conditions minimales obligatoires.",
      links: [
        { label: "Modèle de contrat SECO", url: "https://www.seco.admin.ch/seco/fr/home/Arbeit/Arbeitsbedingungen/Normalarbeitsvertraege.html" },
        { label: "Contrats-types cantonaux (CTT)", url: "https://www.ch.ch/fr/travail/conditions-de-travail/contrat-type-de-travail/" },
      ],
      order: 3,
    },
    {
      key: "accident_insurance",
      title: "Souscrire l'assurance accidents (LAA)",
      description: "L'assurance accidents est obligatoire dès 8 heures de travail par semaine.",
      guidance: "Si votre employé(e) travaille 8 heures ou plus par semaine chez vous, vous devez souscrire une assurance accidents professionnels ET non professionnels (LAA). En dessous de 8h, seuls les accidents professionnels sont couverts. Contactez un assureur LAA reconnu (SUVA, Zurich, AXA, Mobilière, etc.).",
      links: [
        { label: "SUVA – Assurance accidents", url: "https://www.suva.ch/fr-ch" },
        { label: "Info LAA sur ch.ch", url: "https://www.ch.ch/fr/travail/assurances-sociales/assurance-accidents/" },
      ],
      order: 4,
    },
    {
      key: "salary_calculation",
      title: "Calculer le salaire net et les déductions",
      description: "Calculez le salaire net après déduction des cotisations sociales.",
      guidance: `Déductions sur le salaire brut de l'employé(e) :\n• AVS/AI/APG : 5.3%\n• AC (chômage) : 1.1%\n• LAA (accidents non prof.) : variable selon l'assureur (~1-2%)\n\nL'employeur paie en plus :\n• AVS/AI/APG : 5.3%\n• AC : 1.1%\n• LAA (accidents prof.) : variable\n• Allocations familiales : variable selon le canton (${canton})\n\nUtilisez un calculateur en ligne pour vérifier les montants exacts.`,
      links: [
        { label: "Calculateur de salaire (comparis.ch)", url: "https://www.comparis.ch/berufsleben/lohn/lohnrechner" },
        { label: "Taux de cotisation AVS actuels", url: "https://www.ahv-iv.ch/fr/Assurances-sociales/Assurance-vieillesse-et-survivants-AVS/Cotisations-AVS-AI-APG" },
      ],
      order: 5,
    },
    {
      key: "payslip",
      title: "Établir la fiche de salaire mensuelle",
      description: "Remettez chaque mois une fiche de salaire détaillée à votre employé(e).",
      guidance: "La fiche de salaire doit contenir : le salaire brut, chaque déduction détaillée (AVS, AI, APG, AC, LAA), le salaire net, la période concernée et les éventuelles heures supplémentaires. Conservez un double pour vos archives. Cette fiche est nécessaire pour la déclaration d'impôts de votre employé(e).",
      links: [
        { label: "Modèle de fiche de salaire (Swisssalary)", url: "https://www.swisssalary.ch" },
      ],
      order: 6,
    },
    {
      key: "withholding_tax",
      title: "Vérifier l'impôt à la source",
      description: "Les employés étrangers sans permis C sont soumis à l'impôt à la source.",
      guidance: "Si votre employé(e) est de nationalité étrangère et ne possède pas de permis d'établissement (permis C), vous devez prélever l'impôt à la source sur son salaire. Le taux dépend du canton de résidence de l'employé(e), de son état civil et de ses revenus. Renseignez-vous auprès de l'administration fiscale cantonale.",
      links: [
        { label: "Impôt à la source – ch.ch", url: "https://www.ch.ch/fr/impots-et-finances/impots/impot-a-la-source/" },
      ],
      order: 7,
    },
    {
      key: "annual_declaration",
      title: "Effectuer la déclaration annuelle de salaires",
      description: "Chaque année en janvier, déclarez les salaires versés à la caisse de compensation.",
      guidance: "Avant le 30 janvier de chaque année, vous devez déclarer à votre caisse de compensation le total des salaires bruts versés l'année précédente. La caisse établira le décompte définitif des cotisations. Conservez les fiches de salaire et les justificatifs pendant 10 ans minimum.",
      links: [
        ...(cantonAvsLink ? [cantonAvsLink] : []),
        { label: "Obligations annuelles employeur", url: "https://www.ch.ch/fr/travail/assurances-sociales/avs/" },
      ],
      order: 8,
    },
    {
      key: "certificate_of_salary",
      title: "Remettre le certificat de salaire annuel",
      description: "Établissez un certificat de salaire pour la déclaration d'impôts de votre employé(e).",
      guidance: "Chaque année, remettez à votre employé(e) un certificat de salaire récapitulant les montants bruts et nets versés, ainsi que les cotisations retenues. Ce document est indispensable pour la déclaration d'impôts. Utilisez le formulaire officiel de l'Administration fédérale des contributions.",
      links: [
        { label: "Formulaire certificat de salaire (AFC)", url: "https://www.estv.admin.ch/estv/fr/accueil/impot-federal-direct/certificat-de-salaire.html" },
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
      guidance: "Les au pairs ressortissants de l'UE/AELE n'ont besoin que d'une annonce en ligne. Pour les autres nationalités, un permis de travail cantonal est nécessaire. L'au pair doit avoir entre 18 et 25 ans, la durée maximale est d'un an. Contactez l'Office de la population de votre canton.",
      links: [
        { label: "Au pair en Suisse – ch.ch", url: "https://www.ch.ch/fr/travail/travailler-en-suisse/au-pair/" },
        { label: "Conditions au pair (SECO)", url: "https://www.seco.admin.ch/seco/fr/home/Arbeit/Personenfreizugigkeit_Arbeitsbeziehungen/au-pair.html" },
      ],
      order: 2.5, // inserted between steps 2 and 3
    });
  }

  // Add elderly care specific step
  if (employmentType === "elderly_care") {
    steps.push({
      key: "spitex_coordination",
      title: "Coordonner avec les services Spitex si nécessaire",
      description: "Si votre proche reçoit déjà des soins à domicile, coordonnez les prestations.",
      guidance: "Si votre proche bénéficie de prestations Spitex ou de soins infirmiers à domicile, informez-les de l'engagement d'une aide supplémentaire. Les prestations complémentaires (PC) de l'AVS/AI peuvent couvrir une partie des frais d'aide à domicile. Renseignez-vous auprès de votre caisse de compensation.",
      links: [
        { label: "Spitex Suisse", url: "https://www.spitex.ch/fr" },
        { label: "Prestations complémentaires", url: "https://www.ahv-iv.ch/fr/Assurances-sociales/Prestations-complementaires" },
      ],
      order: 2.5,
    });
  }

  return steps.sort((a, b) => a.order - b.order);
}
