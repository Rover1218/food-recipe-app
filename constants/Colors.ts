// Updated color palette for the food recipe app
const colors = {
  // Primary colors
  primary: '#6c5ce7',      // Purple - primary brand color
  primaryLight: '#a29bfe', // Light purple for accents
  primaryDark: '#4834d4',  // Dark purple for focused/pressed states

  // Secondary colors
  secondary: '#fd79a8',    // Pink - secondary accent
  secondaryLight: '#fab1c9',
  secondaryDark: '#e84393',

  // Accent colors
  accent1: '#ffeaa7',      // Soft yellow
  accent2: '#55efc4',      // Teal
  accent3: '#ff7675',      // Coral

  // Background colors
  backgroundLight: '#f8fafc',
  backgroundDark: '#1a1a2e',
  cardLight: '#ffffff',
  cardDark: '#16213e',

  // Text colors
  textPrimary: '#2d3748',    // Dark gray for primary text
  textSecondary: '#718096',  // Medium gray for secondary text
  textLight: '#a0aec0',      // Light gray for tertiary/hint text
  textWhite: '#ffffff',
  textDark: '#1a202c',

  // Status colors
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',

  // UI element colors
  border: '#e2e8f0',
  divider: '#edf2f7',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  inactive: '#cbd5e0',

  // Category badge colors
  categoryBreakfast: '#48bb78',
  categoryLunch: '#f6ad55',
  categoryDinner: '#f56565',
  categoryDessert: '#ed64a6',
  categoryDrink: '#4299e1',
  categorySeafood: '#38b2ac',
  categoryVegetarian: '#68d391',
  categoryMeat: '#fc8181',

  // Cuisine badge colors
  cuisineItalian: '#a0aec0',
  cuisineMexican: '#f6ad55',
  cuisineIndian: '#fc8181',
  cuisineThai: '#68d391',
  cuisineChinese: '#f687b3',
  cuisineJapanese: '#63b3ed',
  cuisineAmerican: '#9f7aea',
  cuisineMediterranean: '#4fd1c5',
};

// Setup for light/dark theme support
export default {
  light: {
    text: colors.textPrimary,
    background: colors.backgroundLight,
    card: colors.cardLight,
    tint: colors.primary,
    tabIconDefault: colors.inactive,
    tabIconSelected: colors.primary,
  },
  dark: {
    text: colors.textWhite,
    background: colors.backgroundDark,
    card: colors.cardDark,
    tint: colors.primaryLight,
    tabIconDefault: colors.textLight,
    tabIconSelected: colors.primaryLight,
  },
  // Export raw colors for direct access
  ...colors
};
