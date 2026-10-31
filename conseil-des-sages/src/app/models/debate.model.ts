import { Sage } from './sage.model';

export type DebateStatus = 'IN_PROGRESS' | 'FINISHED' | 'ARCHIVED';
export type StepStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

export interface DebateMessage {
  id: number;
  stepId: number;
  participantId: number;
  authorName: string;
  fromUser: boolean;
  content: string;
  model: string | null;
  repliesToParticipantId: number | null;
  createdAt: string;
}

/** Une remarque du Greffier : elle s'affiche une fois afterTurns interventions prononcées. */
export interface ScribeNote {
  id: number;
  afterTurns: number;
  content: string;
  createdAt: string;
}

export interface DebateStep {
  id: number;
  order: number;
  name: string;
  status: StepStatus;
  messages: DebateMessage[];
}

export interface SynthesisCriterion {
  label: string;
  hint?: string;
  scores: number[];
}

export interface SynthesisDisagreement {
  topic: string;
  detail: string;
  sages?: string[];
}

export interface Synthesis {
  verdict: string;
  theme?: string;
  options?: string[];
  criteria?: SynthesisCriterion[];
  consensus?: string[];
  disagreements?: SynthesisDisagreement[];
  openQuestions?: string[];
}

export interface DebateSummary {
  id: number;
  title: string;
  status: DebateStatus;
  theme: string | null;
  createdAt: string;
  sages: Sage[];
}

export interface DebateDetail {
  id: number;
  question: string;
  context: string | null;
  status: DebateStatus;
  theme: string | null;
  createdAt: string;
  sages: Sage[];
  scribe: Sage | null;
  steps: DebateStep[];
  notes: ScribeNote[];
  synthesis: Synthesis | null;
}

export interface NewDebate {
  question: string;
  context?: string;
  sageIds: number[];
}

/** Les événements du flux GET /api/debates/{id}/events */
export type DebateEvent =
  | { type: 'step'; data: { stepId: number; status: StepStatus } }
  | { type: 'turn'; data: { sageId: number; stepId: number } }
  | { type: 'delta'; data: { text: string } }
  | { type: 'reset'; data: Record<string, never> }
  | { type: 'message'; data: DebateMessage }
  | { type: 'note'; data: ScribeNote }
  | { type: 'synthesis'; data: Synthesis }
  | { type: 'status'; data: { status: DebateStatus } }
  | { type: 'failure'; data: { detail: string } };
