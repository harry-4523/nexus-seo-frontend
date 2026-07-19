import { create } from 'zustand';
import { AnalysisResult, User, ScanSummary } from '../types/analysis.types';

interface AnalysisStore {
  // Current analysis
  currentResult: AnalysisResult | null;
  isAnalyzing: boolean;
  analysisError: string | null;
  analysisProgress: number;
  analysisStage: string;
  setCurrentResult: (result: AnalysisResult | null) => void;
  setIsAnalyzing: (v: boolean) => void;
  setAnalysisError: (e: string | null) => void;
  setAnalysisProgress: (p: number, stage?: string) => void;

  // Auth
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;

  // History
  scanHistory: ScanSummary[];
  setScanHistory: (scans: ScanSummary[]) => void;

  // UI
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  currentResult: null,
  isAnalyzing: false,
  analysisError: null,
  analysisProgress: 0,
  analysisStage: '',
  setCurrentResult: (result) => set({ currentResult: result }),
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),
  setAnalysisError: (e) => set({ analysisError: e }),
  setAnalysisProgress: (p, stage = '') => set({ analysisProgress: p, analysisStage: stage }),

  user: JSON.parse(localStorage.getItem('nexus_user') || 'null'),
  token: localStorage.getItem('nexus_token'),
  setUser: (user) => {
    set({ user });
    if (user) localStorage.setItem('nexus_user', JSON.stringify(user));
    else localStorage.removeItem('nexus_user');
  },
  setToken: (token) => {
    set({ token });
    if (token) localStorage.setItem('nexus_token', token);
    else localStorage.removeItem('nexus_token');
  },
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
  },

  scanHistory: [],
  setScanHistory: (scans) => set({ scanHistory: scans }),

  activeTab: 'seo',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
