// Crystal Chess Types
import { Chess, Square } from 'chess.js';

export type Color = 'w' | 'b';
export type GameStatus = 'ongoing' | 'checkmate' | 'stalemate' | 'draw' | 'resigned' | 'timeout';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface Piece {
  color: Color;
  type: PieceType;
}

export interface Position {
  fen: string;
  turn: Color;
  castling: { w: { k: boolean; q: boolean }; b: { k: boolean; q: boolean } };
  enPassant: Square | null;
  halfMoves: number;
  fullMoves: number;
}

export interface Move {
  from: Square;
  to: Square;
  san: string;
  piece: Piece;
  captured?: Piece;
  promotion?: PieceType;
  isCheck: boolean;
  isCheckmate: boolean;
  isCapture: boolean;
  isPromotion: boolean;
  isCastling: boolean;
  beforeFen: string;
  afterFen: string;
  timestamp: number;
  timeSpent: number; // milliseconds
}

export interface GameState {
  id: string;
  fen: string;
  moves: Move[];
  status: GameStatus;
  turn: Color;
  result?: 'w' | 'b' | 'draw';
  white: PlayerInfo;
  black: PlayerInfo;
  clocks: { w: number; b: number }; // seconds remaining
  timeControl: TimeControl;
  startTime: number;
  lastMoveTime: number;
  orientation: Color;
}

export interface PlayerInfo {
  id: string;
  name: string;
  elo: number;
  isHuman: boolean;
  avatar?: string;
  aiLevel?: AIDifficulty;
}

export type AIDifficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert' | 'master' | 'grandmaster';

export interface TimeControl {
  id: string;
  label: string;
  initial: number; // seconds
  increment: number; // seconds
}

export interface UserProfile {
  id: string;
  username: string;
  elo: number;
  avatar?: string;
  createdAt: number;
  stats: GameStats;
  achievements: Achievement[];
  settings: UserSettings;
}

export interface GameStats {
  total: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentStreak: number; // positive = wins, negative = losses
  longestWinStreak: number;
  longestLossStreak: number;
  avgGameDuration: number; // seconds
  totalPlayTime: number; // seconds
  ratingHistory: { date: number; elo: number }[];
  gamesByTimeControl: Record<string, { played: number; won: number }>;
  gamesVsAI: Record<AIDifficulty, { played: number; won: number }>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  progress?: number;
  target?: number;
}

export interface UserSettings {
  pieceSet: 'crystal' | 'classic' | 'modern';
  boardTheme: 'classic' | 'gold' | 'crystal' | 'dark' | 'wood';
  soundEnabled: boolean;
  musicEnabled: boolean;
  moveConfirmation: boolean;
  hintsEnabled: boolean;
  language: 'tr' | 'en';
  notifications: boolean;
  vibration: boolean;
  autoSave: boolean;
  showCoordinates: boolean;
  showLegalMoves: boolean;
  showLastMove: boolean;
  clockPosition: 'top' | 'bottom' | 'both';
}

export interface Puzzle {
  id: string;
  fen: string;
  solution: string[];
  rating: number;
  themes: string[];
  description: string;
  hint?: string;
}

export interface PuzzleProgress {
  currentPuzzleIndex: number;
  solved: string[]; // puzzle ids
  failed: string[];
  streak: number;
  totalSolved: number;
  rating: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  elo: number;
  avatar?: string;
  gamesPlayed: number;
  winRate: number;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  ownerId: string;
  members: ClubMember[];
  createdAt: number;
}

export interface ClubMember {
  userId: string;
  username: string;
  elo: number;
  role: 'owner' | 'admin' | 'member';
  joinedAt: number;
}

export type TabName = 'home' | 'games' | 'leaderboard' | 'club' | 'settings';

export type RootStackParamList = {
  '(tabs)': undefined;
  'game': { gameId?: string };
  'new-game': undefined;
  'puzzle': { puzzleId?: string };
  'game-over': { gameId: string };
  'profile': { userId?: string };
  'stats': undefined;
  'settings': undefined;
  'achievements': undefined;
  'game-history': undefined;
};