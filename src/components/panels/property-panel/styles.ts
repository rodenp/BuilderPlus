import type { Theme } from './theme';

export const createInputStyle = (theme: Theme): React.CSSProperties => ({
  width: '100%',
  height: '36px',
  padding: '0 12px',
  fontSize: '14px',
  backgroundColor: theme.bgSecondary,
  border: `1px solid ${theme.border}`,
  borderRadius: '6px',
  color: theme.text,
  outline: 'none',
  colorScheme: theme.mode,
});

export const createLabelStyle = (theme: Theme): React.CSSProperties => ({
  fontSize: '12px',
  fontWeight: 500,
  color: theme.textMuted,
  marginBottom: '6px',
  display: 'block',
});

export const createButtonGroupStyle = (
  theme: Theme,
  isActive: boolean
): React.CSSProperties => ({
  flex: 1,
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  transition: 'all 0.15s',
  backgroundColor: isActive ? theme.primary : theme.bgSecondary,
  color: isActive ? '#ffffff' : theme.textMuted,
  border: 'none',
  cursor: 'pointer',
});

export const createSmallInputStyle = (theme: Theme): React.CSSProperties => ({
  width: '100%',
  height: '28px',
  padding: '0 4px',
  textAlign: 'center',
  fontSize: '12px',
  backgroundColor: theme.bgSecondary,
  border: `1px solid ${theme.border}`,
  borderRadius: '4px',
  color: theme.text,
  outline: 'none',
  colorScheme: theme.mode,
});

export const createDurationInputStyle = (theme: Theme): React.CSSProperties => ({
  ...createInputStyle(theme),
  textAlign: 'center',
  padding: '4px',
});
