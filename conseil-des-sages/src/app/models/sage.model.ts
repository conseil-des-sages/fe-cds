export type SageColor =
  | 'prudent'
  | 'optimiste'
  | 'financier'
  | 'avocat'
  | 'futur'
  | 'cyan'
  | 'orange'
  | 'indigo';

export type SageOrigin = 'base' | 'mine' | 'library';

export type AvatarState = 'idle' | 'speaking' | 'thinking' | 'dimmed' | 'selected';

export interface Sage {
  id: number;
  name: string;
  shortName: string;
  description: string;
  color: SageColor;
  icon: string;
  origin: SageOrigin;
  creator: string | null;
  shared: boolean;
  inDefaultCouncil: boolean;
  uses: number;
  /** Renseignés uniquement pour le créateur du sage */
  prompt: string | null;
  model: string | null;
  temperature: number | null;
  maxTokens: number | null;
}

export interface SageDraft {
  name: string;
  description: string;
  prompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  color: SageColor;
  icon: string;
  shared: boolean;
}

export const SAGE_COLORS: { id: SageColor; label: string }[] = [
  { id: 'prudent', label: 'Bleu' },
  { id: 'optimiste', label: 'Ambre' },
  { id: 'financier', label: 'Vert' },
  { id: 'avocat', label: 'Corail' },
  { id: 'futur', label: 'Violet' },
  { id: 'cyan', label: 'Cyan' },
  { id: 'orange', label: 'Orange' },
  { id: 'indigo', label: 'Indigo' },
];

export const AVATAR_ICONS = [
  'shield', 'sun', 'coins', 'flame', 'hourglass', 'compass', 'feather', 'leaf',
  'moon', 'mountain', 'anchor', 'heart', 'brain', 'scale', 'lightbulb', 'telescope',
];

/** "répond au Financier", "répond à l'Optimiste"... */
export function replyLabel(name: string): string {
  if (name.startsWith('Le ')) return `au ${name.slice(3)}`;
  if (name.startsWith('Les ')) return `aux ${name.slice(4)}`;
  if (name.startsWith('La ')) return `à la ${name.slice(3)}`;
  if (name.startsWith("L'") || name.startsWith('L’')) return `à l'${name.slice(2)}`;
  return `à ${name}`;
}
