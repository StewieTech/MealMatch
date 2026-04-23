export const theme = {
  colors: {
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceMuted: '#f1f5f9',
    border: '#e2e8f0',
    borderStrong: '#cbd5e1',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    accent: '#ea580c',
    accentSoft: '#fed7aa',
    accentDark: '#c2410c',
    danger: '#dc2626',
    success: '#16a34a',
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 20,
    pill: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
};

export type AppTheme = typeof theme;
