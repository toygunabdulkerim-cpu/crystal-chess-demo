// Utility functions
import { Square } from 'chess.js';
import { COLORS, FILES, RANKS } from '@/constants/design';

const FILES_ARR = [...FILES] as string[];
const RANKS_ARR = [...RANKS] as string[];

export const squareToCoords = (
  square: string,
  orientation: 'w' | 'b',
  squareSize: number
): { x: number; y: number; col: number; row: number } => {
  const file = FILES_ARR.indexOf(square[0]);
  const rank = RANKS_ARR.indexOf(square[1]);
  const displayFile = orientation === 'w' ? file : 7 - file;
  const displayRank = orientation === 'w' ? 7 - rank : rank;
  return {
    x: displayFile * squareSize + squareSize / 2,
    y: displayRank * squareSize + squareSize / 2,
    col: displayFile,
    row: displayRank,
  };
};

export const coordsToSquare = (
  x: number,
  y: number,
  orientation: 'w' | 'b',
  squareSize: number
): string | null => {
  const file = Math.floor(x / squareSize);
  const rank = Math.floor(y / squareSize);
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;
  const displayFile = orientation === 'w' ? file : 7 - file;
  const displayRank = orientation === 'w' ? 7 - rank : rank;
  return `${FILES[displayFile]}${RANKS[displayRank]}`;
};

export const formatTime = (seconds: number): string => {
  if (seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const formatTimeLong = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
};

export const formatElo = (elo: number): string => {
  return elo.toLocaleString();
};

export const getResultText = (result: 'w' | 'b' | 'draw' | undefined, perspective: 'w' | 'b'): string => {
  if (!result) return 'Devam ediyor';
  if (result === 'draw') return 'Berabere';
  return result === perspective ? 'Galibiyet' : 'Mağlubiyet';
};

export const getResultColor = (result: 'w' | 'b' | 'draw' | undefined, perspective: 'w' | 'b'): string => {
  if (!result) return COLORS.textSecondary;
  if (result === 'draw') return COLORS.draw;
  return result === perspective ? COLORS.win : COLORS.loss;
};

export const calculateEloChange = (
  playerElo: number,
  opponentElo: number,
  result: 'win' | 'loss' | 'draw',
  kFactor = 20
): number => {
  const expected = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  const actual = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0;
  return Math.round(kFactor * (actual - expected));
};

export const getSquareColor = (
  row: number,
  col: number,
  isLastMove: boolean,
  isCheck: boolean,
  isSelected: boolean,
  isLegal: boolean,
  boardTheme: string
): string => {
  const isLight = (row + col) % 2 === 0;
  let baseColor = isLight ? COLORS.squareLight : COLORS.squareDark;

  if (boardTheme === 'gold') {
    baseColor = isLight ? COLORS.squareLightAlt : COLORS.squareDarkAlt;
  }

  if (isCheck) return COLORS.check;
  if (isLastMove) return COLORS.lastMove;
  if (isSelected) return COLORS.selected;
  if (isLegal) return COLORS.legalMove;

  return baseColor;
};

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const hapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
  // React Native haptic feedback would go here
  // For now, placeholder
  console.log(`Haptic: ${type}`);
};