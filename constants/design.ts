// Crystal Chess Design System - Constants
export const COLORS = {
  // Background layers
  bgDeep: '#0a0a0f',           // Deepest background
  bgSurface: '#11121a',        // Card/surface background
  bgElevated: '#16171f',       // Elevated surfaces (modals, sheets)
  bgOverlay: 'rgba(10, 10, 15, 0.85)', // Modal overlay

  // Borders & dividers
  border: '#2a2b3a',           // Primary border
  borderSubtle: '#1e1f2e',     // Subtle divider
  borderGold: '#d4a843',       // Gold accent border

  // Text
  textPrimary: '#f0f0f5',      // Primary text
  textSecondary: '#a8a8b8',    // Secondary text
  textMuted: '#6b6b7a',        // Muted/disabled text
  textGold: '#ffd700',         // Gold text (ELO, highlights)
  textGoldDim: 'rgba(255, 215, 0, 0.7)',

  // Accent - Crystal/Gold theme
  gold: '#d4a843',             // Primary gold
  goldBright: '#ffd700',       // Bright gold
  goldDim: 'rgba(212, 168, 67, 0.3)',
  goldGlow: 'rgba(212, 168, 67, 0.5)',

  // Crystal accents
  crystal: '#00d4ff',          // Crystal cyan
  crystalDim: 'rgba(0, 212, 255, 0.15)',
  crystalGlow: 'rgba(0, 212, 255, 0.4)',

  // Game states
  check: 'rgba(255, 68, 102, 0.6)',    // Check highlight
  lastMove: 'rgba(0, 212, 255, 0.25)', // Last move highlight
  legalMove: 'rgba(0, 212, 255, 0.35)', // Legal move indicator
  selected: 'rgba(212, 168, 67, 0.4)',  // Selected square

  // Square colors (chess board)
  pieceWhite: '#f5f5f5',
  pieceBlack: '#d0b060',
  squareLight: 'rgba(255, 255, 255, 0.04)',
  squareDark: 'rgba(0, 0, 0, 0.25)',
  squareLightAlt: 'rgba(212, 168, 67, 0.03)', // Gold-tinted light
  squareDarkAlt: 'rgba(212, 168, 67, 0.08)',  // Gold-tinted dark

  // Status colors
  win: '#4ade80',      // Green
  loss: '#f87171',     // Red
  draw: '#fbbf24',     // Amber
  online: '#22c55e',   // Online indicator

  // Tab bar
  tabBg: 'rgba(17, 18, 26, 0.95)',
  tabBorder: '#2a2b3a',
  tabActive: '#d4a843',
  tabInactive: '#6b6b7a',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  gold: {
    shadowColor: '#d4a843',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  crystal: {
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const TYPOGRAPHY = {
  fontFamily: 'SpaceGrotesk',
  fontFamilyFallback: 'System',

  // Display
  displayLarge: { fontSize: 36, fontWeight: '700' as const, letterSpacing: 1 },
  displayMedium: { fontSize: 28, fontWeight: '700' as const, letterSpacing: 0.5 },
  displaySmall: { fontSize: 22, fontWeight: '600' as const },

  // Headlines
  headlineLarge: { fontSize: 20, fontWeight: '600' as const },
  headlineMedium: { fontSize: 18, fontWeight: '600' as const },
  headlineSmall: { fontSize: 16, fontWeight: '600' as const },

  // Body
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },

  // Labels
  labelLarge: { fontSize: 14, fontWeight: '500' as const },
  labelMedium: { fontSize: 12, fontWeight: '500' as const },
  labelSmall: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.5 },

  // Monospace (clocks, ELO)
  monoLarge: { fontSize: 20, fontWeight: '600' as const, fontFamily: 'monospace' },
  monoMedium: { fontSize: 16, fontWeight: '500' as const, fontFamily: 'monospace' },
  monoSmall: { fontSize: 12, fontWeight: '400' as const, fontFamily: 'monospace' },
};

export const Z_INDEX = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  modalOverlay: 299,
  toast: 400,
  tooltip: 500,
};

export const ANIMATION = {
  fast: 150,
  normal: 250,
  slow: 400,
  spring: { damping: 15, stiffness: 150 },
};

// Game constants
export const AI_LEVELS = [
  { id: 'beginner', name: 'Başlangıç', depth: 1, elo: 800, color: '#4ade80' },
  { id: 'easy', name: 'Kolay', depth: 2, elo: 1100, color: '#86efac' },
  { id: 'medium', name: 'Orta', depth: 3, elo: 1400, color: '#fbbf24' },
  { id: 'hard', name: 'Zor', depth: 4, elo: 1700, color: '#fb923c' },
  { id: 'expert', name: 'Uzman', depth: 5, elo: 2000, color: '#f87171' },
  { id: 'master', name: 'Usta', depth: 6, elo: 2300, color: '#e879f9' },
  { id: 'grandmaster', name: 'Großmeister', depth: 7, elo: 2600, color: '#d4a843' },
] as const;

export const TIME_CONTROLS = [
  { id: 'bullet', label: 'Bullet (1+0)', initial: 60, increment: 0 },
  { id: 'blitz3', label: 'Blitz (3+0)', initial: 180, increment: 0 },
  { id: 'blitz5', label: 'Blitz (5+0)', initial: 300, increment: 0 },
  { id: 'rapid10', label: 'Rapid (10+0)', initial: 600, increment: 0 },
  { id: 'rapid15', label: 'Rapid (15+10)', initial: 900, increment: 10 },
  { id: 'classical', label: 'Classical (30+0)', initial: 1800, increment: 0 },
] as const;

export const TABS = [
  { name: 'home', label: 'Ana Sayfa', icon: 'home', href: '/(tabs)/home' },
  { name: 'games', label: 'Oyunlar', icon: 'game', href: '/(tabs)/games' },
  { name: 'leaderboard', label: 'Liderlik', icon: 'trophy', href: '/(tabs)/leaderboard' },
  { name: 'club', label: 'Kulüp', icon: 'shield', href: '/(tabs)/club' },
  { name: 'settings', label: 'Ayarlar', icon: 'settings', href: '/(tabs)/settings' },
] as const;

export const PIECE_SYMBOLS = {
  w: { p: '♙', n: '♘', b: '♗', r: '♖', q: '♕', k: '♔' },
  b: { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚' },
} as const;

export const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
export const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;