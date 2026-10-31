import { Sage, SageColor } from '@/models/sage.model';

function baseSage(
  id: number,
  name: string,
  shortName: string,
  color: SageColor,
  icon: string,
  description: string,
): Sage {
  return {
    id, name, shortName, color, icon, description,
    origin: 'base', creator: null, shared: true, inDefaultCouncil: true, uses: 0,
    prompt: null, model: null, temperature: null, maxTokens: null,
  };
}

/** Le contenu de présentation de la page d'accueil, affiché sans compte ni appel au serveur. */
export const LANDING_SAGES: Sage[] = [
  baseSage(2, 'Le Prudent', 'Prudent', 'prudent', 'shield', 'Identifie les risques, ce qui peut mal tourner, le plan B.'),
  baseSage(3, "L'Optimiste", 'Optimiste', 'optimiste', 'sun', "Met en avant les opportunités et ce qu'on regretterait de ne pas tenter."),
  baseSage(4, 'Le Financier', 'Financier', 'financier', 'coins', 'Chiffre les coûts, les gains et la rentabilité de chaque option.'),
  baseSage(5, "L'Avocat du diable", 'Avocat', 'avocat', 'flame', "Attaque systématiquement l'option qui semble gagner, ne cède jamais."),
  baseSage(6, 'Le Toi du futur', 'Toi du futur', 'futur', 'hourglass', 'Parle depuis dans 10 ans : regrets, fiertés, ce qui a vraiment compté.'),
];

export const LANDING_QUESTION = 'Alternance à Lyon ou master à Paris ?';

export const LANDING_LINES: Record<number, string> = {
  2: 'Et si le contrat n’est pas signé avant juin ?',
  3: 'Deux ans d’expérience, c’est un vrai tremplin.',
  4: 'Regarde ce que chaque option te coûte sur deux ans.',
  5: 'Tout le monde penche pour Lyon. Attaquons Lyon.',
  6: 'Dans dix ans, je me souviens surtout des gens.',
};

export const LANDING_STEPS = [
  {
    icon: 'message',
    title: 'Pose ta question',
    text: 'Décris ton dilemme en une phrase. Ajoute du contexte si tu veux : budget, délais, ce qui compte pour toi.',
    example: '« Alternance à Lyon ou master à Paris ? »',
  },
  {
    icon: 'users',
    title: 'Les sages débattent',
    text: 'Des personnalités opposées s’affrontent en direct, en trois temps. Tu peux préciser ta situation à tout moment.',
    example: 'Ouverture · Confrontation · Position finale',
  },
  {
    icon: 'sparkles',
    title: 'Reçois une synthèse',
    text: 'Un tableau de scores, les points de consensus, les vrais désaccords et les questions qui restent à te poser.',
    example: 'Critères · Consensus · Désaccords',
  },
];
