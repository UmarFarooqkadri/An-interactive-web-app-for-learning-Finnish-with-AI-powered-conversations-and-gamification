// Duolingo-inspired theme
export const COLORS = {
  // Primary colors
  primary: '#58CC02',      // Duolingo green
  primaryDark: '#46A302',  // Darker green
  primaryLight: '#89E219', // Lighter green

  // Secondary colors
  secondary: '#1CB0F6',    // Bright blue
  secondaryDark: '#1899D6',
  secondaryLight: '#58D3FF',

  // Accent colors
  accent: '#FFD900',       // Bright yellow
  accentOrange: '#FF9600', // Orange
  danger: '#FF4B4B',       // Red
  success: '#58CC02',      // Green (same as primary)

  // Neutral colors
  white: '#FFFFFF',
  background: '#F7F7F7',   // Light gray background
  cardBg: '#FFFFFF',       // Card background
  border: '#E5E5E5',       // Border color

  // Text colors
  textPrimary: '#3C3C3C',  // Dark gray
  textSecondary: '#777777', // Medium gray
  textLight: '#AFAFAF',    // Light gray
  textWhite: '#FFFFFF',

  // Status colors
  online: '#58CC02',
  offline: '#AFAFAF',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 999,
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  weights: {
    regular: '400',
    medium: '600',
    bold: '700',
    extraBold: '800',
  },
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
