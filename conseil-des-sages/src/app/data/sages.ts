import { DebateSummary, Intervention, SageColor, Sage } from './models';

export const SAGE_COLORS: { id: SageColor; label: string }[] = [
  { id: 'bleu', label: 'Bleu' },
  { id: 'orange', label: 'Orange' },
  { id: 'vert', label: 'Vert' },
  { id: 'rouge', label: 'Rouge' },
  { id: 'violet', label: 'Violet' },
  { id: 'cyan', label: 'Cyan' },
  { id: 'rose', label: 'Rose' },
  { id: 'ambre', label: 'Ambre' },
];

export const AVATAR_ICONS = [
  'shield',
  'sun',
  'coins',
  'flame',
  'hourglass',
  'compass',
  'feather',
  'leaf',
  'moon',
  'mountain',
  'anchor',
  'heart',
  'brain',
  'scale',
  'lightbulb',
  'telescope',
];

export const AI_MODELS = [
  { id: 'gpt-5-mini', label: 'GPT-5 mini — rapide et équilibré' },
  { id: 'claude-sonnet-4.5', label: 'Claude Sonnet 4.5 — nuancé' },
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash — très rapide' },
  { id: 'mistral-large', label: 'Mistral Large — francophone' },
];

export const BASE_SAGES: Sage[] = [
  {
    id: 'prudent',
    name: 'Le Prudent',
    shortName: 'Prudent',
    description: 'Voit les risques avant tout le monde et prépare toujours un plan B.',
    color: 'bleu',
    icon: 'shield',
    origin: 'base',
  },
  {
    id: 'optimiste',
    name: "L'Optimiste",
    shortName: 'Optimiste',
    description: 'Repère les opportunités cachées et ce que chaque option peut t’apporter.',
    color: 'orange',
    icon: 'sun',
    origin: 'base',
  },
  {
    id: 'financier',
    name: 'Le Financier',
    shortName: 'Financier',
    description: 'Chiffre les coûts, les revenus et le retour sur investissement de chaque choix.',
    color: 'vert',
    icon: 'coins',
    origin: 'base',
  },
  {
    id: 'avocat',
    name: "L'Avocat du diable",
    shortName: 'Avocat',
    description: 'Attaque systématiquement l’option favorite pour éprouver sa solidité.',
    color: 'rouge',
    icon: 'flame',
    origin: 'base',
  },
  {
    id: 'futur',
    name: 'Le Toi du futur',
    shortName: 'Toi du futur',
    description: 'Te parle depuis dans 10 ans, avec le recul de celui qui a déjà choisi.',
    color: 'violet',
    icon: 'hourglass',
    origin: 'base',
  },
];

export const MY_SAGES: Sage[] = [
  {
    id: 'mamie',
    name: 'Mamie Jeanne',
    shortName: 'Mamie',
    description: 'Bienveillante et terre à terre, elle ramène tout à la santé, aux proches et au sommeil.',
    color: 'rose',
    icon: 'heart',
    origin: 'mine',
    creator: 'Camille',
    shared: true,
    uses: 214,
  },
  {
    id: 'coach',
    name: 'Le Coach',
    shortName: 'Coach',
    description: 'Pousse à l’action : fixe des étapes concrètes et une date limite pour chaque option.',
    color: 'ambre',
    icon: 'mountain',
    origin: 'mine',
    creator: 'Camille',
    shared: false,
  },
  {
    id: 'stoicien',
    name: 'Le Stoïcien',
    shortName: 'Stoïcien',
    description: 'Distingue ce qui dépend de toi de ce qui n’en dépend pas, et t’aide à lâcher le reste.',
    color: 'cyan',
    icon: 'anchor',
    origin: 'mine',
    creator: 'Camille',
    shared: true,
    uses: 58,
  },
];

export const LIBRARY_SAGES: Sage[] = [
  {
    id: 'ecolo',
    name: "L'Écologiste",
    shortName: 'Écologiste',
    description: 'Mesure l’empreinte carbone et l’impact de chaque option sur ton mode de vie.',
    color: 'vert',
    icon: 'leaf',
    origin: 'library',
    creator: 'Inès_R',
    uses: 3412,
  },
  {
    id: 'aventurier',
    name: "L'Aventurier",
    shortName: 'Aventurier',
    description: 'Choisit toujours l’option qui fera la meilleure histoire à raconter.',
    color: 'orange',
    icon: 'compass',
    origin: 'library',
    creator: 'tomdlv',
    uses: 2870,
  },
  {
    id: 'psy',
    name: 'La Psy',
    shortName: 'Psy',
    description: 'Interroge tes émotions et ce que tu cherches vraiment derrière la décision.',
    color: 'violet',
    icon: 'brain',
    origin: 'library',
    creator: 'Léa.M',
    uses: 5108,
  },
  {
    id: 'juriste',
    name: 'Le Juriste',
    shortName: 'Juriste',
    description: 'Vérifie les contrats, les délais légaux et les clauses à ne pas rater.',
    color: 'bleu',
    icon: 'scale',
    origin: 'library',
    creator: 'Hugo_B',
    uses: 1204,
  },
  {
    id: 'poete',
    name: 'Le Poète',
    shortName: 'Poète',
    description: 'Cherche l’option qui a le plus de sens et de beauté, au-delà des chiffres.',
    color: 'rose',
    icon: 'feather',
    origin: 'library',
    creator: 'Nour',
    uses: 986,
  },
  {
    id: 'inventeur',
    name: "L'Inventeur",
    shortName: 'Inventeur',
    description: 'Refuse le choix binaire et propose une troisième voie à laquelle personne n’a pensé.',
    color: 'ambre',
    icon: 'lightbulb',
    origin: 'library',
    creator: 'Sacha',
    uses: 4021,
  },
];

export const DEFAULT_PROMPT = `Tu es Le Coach, un sage du Conseil. Tu es énergique, direct et bienveillant.
Ton rôle : transformer chaque option en plan d’action concret.
- Propose toujours 3 étapes précises et une date limite.
- Pose une question qui oblige l’utilisateur à s’engager.
- Évite le jargon et les généralités ; reste en dessous de 120 mots.
Tu ne prends jamais la décision à la place de l’utilisateur.`;

export const QUESTION = 'Alternance à Lyon ou master à Paris ?';

export const USER = {
  pseudo: 'Camille',
  fullName: 'Camille Moreau',
  handle: '@camille.mro',
  email: 'camille.moreau@mail.fr',
  initials: 'CM',
  since: 'mars 2026',
};

export const TRENDS = [
  { label: 'Études & orientation', share: 34 },
  { label: 'Premier emploi', share: 22 },
  { label: 'Logement', share: 17 },
  { label: 'Couple & amitiés', share: 15 },
  { label: 'Argent', share: 12 },
];

export const TOTAL_DEBATES = 128437;

export const SUGGESTIONS = [
  'Alternance à Lyon ou master à Paris ?',
  'Accepter le CDI ou partir en PVT au Canada ?',
  'Colocation à 4 ou studio seul·e ?',
];

export const HISTORY: DebateSummary[] = [
  {
    id: 'd1',
    title: 'Alternance à Lyon ou master à Paris ?',
    date: '12 oct. 2026',
    status: 'en-cours',
    sages: ['prudent', 'optimiste', 'financier', 'avocat', 'futur'],
  },
  {
    id: 'd2',
    title: 'Garder ma Clio ou passer au vélo électrique ?',
    date: '28 sept. 2026',
    status: 'termine',
    sages: ['financier', 'ecolo', 'prudent', 'avocat', 'futur'],
  },
  {
    id: 'd3',
    title: 'Partir en Erasmus à Lisbonne au S2 ?',
    date: '3 sept. 2026',
    status: 'termine',
    sages: ['aventurier', 'optimiste', 'financier', 'mamie', 'futur'],
  },
  {
    id: 'd4',
    title: 'Me réorienter en développement web ?',
    date: '14 juin 2026',
    status: 'archive',
    sages: ['prudent', 'coach', 'financier', 'avocat', 'futur'],
  },
  {
    id: 'd5',
    title: 'Emménager avec Théo dès janvier ?',
    date: '2 avr. 2026',
    status: 'archive',
    sages: ['mamie', 'psy', 'prudent', 'avocat', 'futur'],
  },
];

export const ALL_SAGES: Sage[] = [...BASE_SAGES, ...MY_SAGES, ...LIBRARY_SAGES];

export function findSage(id: string): Sage | undefined {
  return ALL_SAGES.find((s) => s.id === id);
}

/** "répond au Financier", "répond à l'Optimiste"... */
export function replyLabel(name: string): string {
  if (name.startsWith('Le ')) return `au ${name.slice(3)}`;
  if (name.startsWith('Les ')) return `aux ${name.slice(4)}`;
  if (name.startsWith('La ')) return `à la ${name.slice(3)}`;
  if (name.startsWith("L'")) return `à l'${name.slice(2)}`;
  return `à ${name}`;
}

export const USER_QUESTION = {
  sageId: 'prudent',
  text: 'Une question avant la confrontation : l’entreprise lyonnaise t’a-t-elle déjà fait une promesse d’embauche écrite, ou seulement un entretien positif ?',
  quickReplies: ['Promesse écrite reçue', 'Seulement un entretien positif', 'Je n’ai pas encore de réponse'],
};

export function buildDebate(answer: string): Intervention[] {
  return [
    {
      sageId: 'prudent',
      step: 'ouverture',
      text: 'Avant de comparer, posons le filet de sécurité. L’alternance à Lyon te garde près de ton réseau et de ton logement actuel : si le contrat se passe mal, tu as un point de chute. À Paris, un master sans revenu, c’est un loyer d’environ 850 € dès septembre. Mon plan B : candidater aux deux et ne trancher qu’une fois le contrat d’alternance signé.',
    },
    {
      sageId: 'optimiste',
      step: 'ouverture',
      text: 'Je vois deux belles portes ! Paris, c’est un réseau d’anciens, des conférences tous les soirs et des stages dans des sièges sociaux. Lyon, c’est deux ans d’expérience concrète sur ton CV avant même ton diplôme — les recruteurs adorent ça. Dans les deux cas, tu avances.',
    },
    {
      sageId: 'financier',
      step: 'ouverture',
      text: 'Chiffrons. Alternance : environ 1 300 € net par mois pendant 24 mois, soit 31 200 € perçus, et une école financée par l’entreprise. Master à Paris : loyer et vie courante autour de 1 400 € par mois sur 20 mois, soit 28 000 € de dépenses. L’écart total dépasse 59 000 €.',
    },
    {
      sageId: 'avocat',
      step: 'ouverture',
      text: 'Tout le monde penche déjà pour Lyon. Alors attaquons Lyon. Une alternance, c’est trois semaines sur quatre en entreprise : tu risques de devenir « la petite main » du service marketing, sans recul théorique. Et si la scale-up licencie dans un an ? Le confort financier peut cacher une impasse.',
    },
    {
      sageId: 'futur',
      step: 'ouverture',
      text: 'Je te parle depuis 2036. Ce dont je me souviens, ce n’est pas la ville : c’est la personne que je suis devenue en chemin. Ce qui a compté, ce sont les gens rencontrés et la liberté de pouvoir dire non. Demande-toi laquelle des deux options te laissera le plus libre dans trois ans.',
    },
    {
      sageId: USER_QUESTION.sageId,
      step: 'ouverture',
      text: USER_QUESTION.text,
      isQuestion: true,
    },
    {
      sageId: 'prudent',
      step: 'confrontation',
      repliesTo: 'user',
      text: `Tu l’as précisé : « ${answer} ». Tant que le contrat n’est pas signé, Lyon reste une hypothèse. Mon conseil : demande une date de signature avant le 15 juin, la date limite d’inscription du master parisien. Tu gardes ainsi les deux portes ouvertes.`,
    },
    {
      sageId: 'financier',
      step: 'confrontation',
      repliesTo: 'avocat',
      text: 'L’impasse coûte moins cher à Lyon. Même si la scale-up licencie au bout d’un an, tu auras touché 15 600 € et gagné une vraie ligne sur ton CV. Une année de master à Paris abandonnée, c’est environ 16 800 € dépensés sans diplôme.',
    },
    {
      sageId: 'avocat',
      step: 'confrontation',
      repliesTo: 'financier',
      text: 'Tu réduis tout à un tableur. Le réseau parisien ne se chiffre pas, et c’est souvent lui qui ouvre les postes à 45 000 € à la sortie. Économiser 59 000 € pour plafonner ensuite, est-ce vraiment une économie ?',
    },
    {
      sageId: 'optimiste',
      step: 'confrontation',
      repliesTo: 'avocat',
      text: 'Le réseau, ça se construit aussi depuis Lyon ! Le TGV met deux heures, les salons parisiens restent accessibles, et une alternance réussie te donne un réseau professionnel réel, pas seulement étudiant.',
    },
    {
      sageId: 'futur',
      step: 'confrontation',
      repliesTo: 'optimiste',
      text: 'L’Optimiste a raison sur un point : je n’ai jamais regretté l’expérience. Mais j’ai failli regretter de ne pas avoir osé partir. Si Paris t’attire pour la ville et pas seulement pour le diplôme, ne l’écarte pas trop vite.',
    },
    {
      sageId: 'prudent',
      step: 'finale',
      text: 'Lyon, à une condition : un contrat signé avant le 15 juin. Sinon, Paris redevient le plan le plus sûr.',
    },
    {
      sageId: 'optimiste',
      step: 'finale',
      text: 'Lyon, pour l’élan : deux ans d’expérience et un salaire, c’est un tremplin. Paris pourra venir plus tard, pour un premier poste.',
    },
    {
      sageId: 'financier',
      step: 'finale',
      text: 'Lyon, sans hésitation sur le plan financier : environ 59 000 € d’écart sur deux ans.',
    },
    {
      sageId: 'avocat',
      step: 'finale',
      text: 'Je maintiens : Paris. Pas parce que c’est mieux, mais parce que personne d’autre ici ne le défend sérieusement. Vérifie que ton choix résiste à mes objections.',
    },
    {
      sageId: 'futur',
      step: 'finale',
      text: 'Je ne choisirai pas à ta place. Choisis l’option dont tu pourras raconter l’histoire avec fierté.',
    },
  ];
}

export const SYNTHESIS = {
  verdict: '4 sages sur 5 penchent pour l’alternance à Lyon, à condition que le contrat soit signé avant le 15 juin.',
  options: ['Alternance à Lyon', 'Master à Paris'],
  criteria: [
    { label: 'Coût', hint: '10 = le plus abordable', scores: [9, 3] },
    { label: 'Épanouissement', hint: 'plaisir, cadre de vie', scores: [7, 8] },
    { label: 'Perspectives', hint: 'carrière à 5 ans', scores: [7, 8] },
    { label: 'Risque', hint: '10 = le plus sûr', scores: [6, 6] },
  ],
  consensus: [
    'Deux ans d’expérience professionnelle sont un atout majeur sur un CV de jeune diplômé·e.',
    'L’écart financier, environ 59 000 € sur deux ans, n’est pas négligeable.',
    'Tout dépend de la signature du contrat d’alternance avant le 15 juin.',
  ],
  disagreements: [
    {
      topic: 'La valeur du réseau parisien',
      detail: 'Décisive pour l’Avocat du diable, compensable depuis Lyon selon l’Optimiste.',
      sages: ['avocat', 'optimiste'],
    },
    {
      topic: 'Le risque de devenir « petite main »',
      detail: 'Réel pour l’Avocat du diable, mineur face à 15 600 € perçus selon le Financier.',
      sages: ['avocat', 'financier'],
    },
  ],
  openQuestions: [
    'Paris t’attire-t-il pour la ville elle-même, ou seulement pour le diplôme ?',
    'Que feras-tu si le contrat n’est pas signé le 15 juin ?',
    'Apprends-tu mieux en cours ou sur le terrain ?',
  ],
};
