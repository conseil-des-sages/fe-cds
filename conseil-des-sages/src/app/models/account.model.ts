export interface Profile {
  id: number;
  name: string;
  email: string;
  role: string | null;
  createdAt: string;
  debates: number;
  sages: number;
}

export interface CouncilView {
  sageIds: number[];
  min: number;
  max: number;
}

export interface Stats {
  totalDebates: number;
  debatesThisWeek: number;
  themes: string[];
}

export interface LlmModel {
  id: string;
  label: string;
  provider: string;
  available: boolean;
}
