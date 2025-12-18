// Theme configuration for the property panel
export interface Theme {
  bg: string;
  bgSecondary: string;
  bgTertiary: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderSecondary: string;
  primary: string;
  primaryBg: string;
  primaryText: string;
  // Box model colors
  marginBg: string;
  marginBorder: string;
  marginText: string;
  paddingBg: string;
  paddingBorder: string;
  paddingText: string;
  contentBg: string;
  contentBorder: string;
  contentText: string;
  mode: 'light' | 'dark';
}

export const lightTheme: Theme = {
  mode: 'light',
  bg: '#ffffff',
  bgSecondary: '#f1f5f9',
  bgTertiary: '#e2e8f0',
  text: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#64748b',
  border: '#e2e8f0',
  borderSecondary: '#cbd5e1',
  primary: '#0ea5e9',
  primaryBg: '#e0f2fe',
  primaryText: '#0369a1',
  marginBg: '#fef3c7',
  marginBorder: '#fcd34d',
  marginText: '#b45309',
  paddingBg: '#d1fae5',
  paddingBorder: '#6ee7b7',
  paddingText: '#047857',
  contentBg: '#dbeafe',
  contentBorder: '#93c5fd',
  contentText: '#1d4ed8',
};

export const darkTheme: Theme = {
  mode: 'dark',
  bg: '#0f172a',
  bgSecondary: '#1e293b',
  bgTertiary: '#334155',
  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  border: '#334155',
  borderSecondary: '#475569',
  primary: '#38bdf8',
  primaryBg: 'rgba(14, 165, 233, 0.2)',
  primaryText: '#7dd3fc',
  marginBg: 'rgba(251, 191, 36, 0.15)',
  marginBorder: 'rgba(251, 191, 36, 0.4)',
  marginText: '#fbbf24',
  paddingBg: 'rgba(52, 211, 153, 0.15)',
  paddingBorder: 'rgba(52, 211, 153, 0.4)',
  paddingText: '#34d399',
  contentBg: 'rgba(59, 130, 246, 0.15)',
  contentBorder: 'rgba(59, 130, 246, 0.4)',
  contentText: '#60a5fa',
};

export const getTheme = (isDarkMode: boolean): Theme => {
  return isDarkMode ? darkTheme : lightTheme;
};
