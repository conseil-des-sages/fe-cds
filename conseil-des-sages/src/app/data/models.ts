export type SageColor = 'bleu' | 'orange' | 'vert' | 'rouge' | 'violet' | 'cyan' | 'rose' | 'ambre';

export type SageOrigin = 'base' | 'mine' | 'library';

export type ResponseLength = 'courtes' | 'moyennes' | 'longues';

export interface Sage {
  id: string;
  name: string;
  shortName: string;
  description: string;
  color: SageColor;
  icon: string;
  origin: SageOrigin;
  creator?: string;
  shared?: boolean;
  uses?: number;
  prompt?: string;
  model?: string;
  temperature?: number;
  length?: ResponseLength;
}

export type DebateStep = 'ouverture' | 'confrontation' | 'finale' | 'synthese';

export interface Intervention {
  sageId: string;
  step: DebateStep;
  text: string;
  repliesTo?: string;
  isQuestion?: boolean;
}

export type DebateStatus = 'en-cours' | 'termine' | 'archive';

export interface DebateSummary {
  id: string;
  title: string;
  date: string;
  status: DebateStatus;
  sages: string[];
}

export type AvatarState = 'idle' | 'speaking' | 'thinking' | 'dimmed' | 'selected';
