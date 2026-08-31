// User Profile Store
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, GameStats, Achievement, UserSettings, AIDifficulty } from '@/types';
import { AI_LEVELS } from '@/constants/design';

const DEFAULT_STATS: GameStats = {
  total: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  winRate: 0,
  currentStreak: 0,
  longestWinStreak: 0,
  longestLossStreak: 0,
  avgGameDuration: 0,
  totalPlayTime: 0,
  ratingHistory: [],
  gamesByTimeControl: {},
  gamesVsAI: AI_LEVELS.reduce((acc, level) => {
    acc[level.id] = { played: 0, won: 0 };
    return acc;
  }, {} as Record<AIDifficulty, { played: number; won: number }>),
};

export const DEFAULT_SETTINGS: UserSettings = {
  pieceSet: 'crystal',
  boardTheme: 'gold',
  soundEnabled: true,
  musicEnabled: false,
  moveConfirmation: false,
  hintsEnabled: true,
  language: 'tr',
  notifications: true,
  vibration: true,
  autoSave: true,
  showCoordinates: true,
  showLegalMoves: true,
  showLastMove: true,
  clockPosition: 'both',
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_win', name: 'İlk Zafer', description: 'İlk oyununu kazan', icon: '🏆', target: 1 },
  { id: 'win_streak_3', name: 'Seri Başladı', description: '3 oyun üst üste kazan', icon: '🔥', target: 3 },
  { id: 'win_streak_10', name: 'Yenilmez', description: '10 oyun üst üste kazan', icon: '💎', target: 10 },
  { id: 'play_50', name: 'Deneyimli', description: '50 oyun oyna', icon: '📊', target: 50 },
  { id: 'play_200', name: 'Usta', description: '200 oyun oyna', icon: '🎖️', target: 200 },
  { id: 'beat_expert', name: 'Uzmanı Yenme', description: 'Uzman seviyesini yen', icon: '🧠', target: 1 },
  { id: 'beat_master', name: 'Ustayı Yenme', description: 'Usta seviyesini yen', icon: '👑', target: 1 },
  { id: 'beat_gm', name: 'Büyük Ustayı Yenme', description: 'Großmeister seviyesini yen', icon: '🏆', target: 1 },
  { id: 'perfect_game', name: 'Mükemmel Oyun', description: 'Hiç taş kaybetmeden kazan', icon: '✨', target: 1 },
  { id: 'comeback', name: 'Geri Dönüş', description: 'Kraliçe kaybedip oyunu kazan', icon: '♛', target: 1 },
];

const generateId = () => Math.random().toString(36).substring(2, 15);

const initialProfile: UserProfile = {
  id: generateId(),
  username: 'Oyuncu',
  elo: 1200,
  createdAt: Date.now(),
  stats: DEFAULT_STATS,
  achievements: DEFAULT_ACHIEVEMENTS,
  settings: DEFAULT_SETTINGS,
};

interface UserStore {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateUsername: (username: string) => void;
  updateElo: (elo: number) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addGameResult: (result: 'win' | 'loss' | 'draw', aiLevel: AIDifficulty, duration: number, timeControlId: string) => void;
  unlockAchievement: (id: string) => void;
  updateAchievementProgress: (id: string, progress: number) => void;
  resetProfile: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      profile: initialProfile,

      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),

      updateUsername: (username) =>
        set((state) => ({
          profile: { ...state.profile, username },
        })),

      updateElo: (elo) =>
        set((state) => ({
          profile: {
            ...state.profile,
            elo,
            stats: {
              ...state.profile.stats,
              ratingHistory: [
                ...state.profile.stats.ratingHistory,
                { date: Date.now(), elo },
              ],
            },
          },
        })),

      updateSettings: (settings) =>
        set((state) => ({
          profile: {
            ...state.profile,
            settings: { ...state.profile.settings, ...settings },
          },
        })),

      addGameResult: (result, aiLevel, duration, timeControlId) =>
        set((state) => {
          const { profile } = state;
          const newStats = { ...profile.stats };
          newStats.total += 1;
          newStats.totalPlayTime += duration;

          if (result === 'win') {
            newStats.wins += 1;
            newStats.currentStreak = Math.max(0, newStats.currentStreak) + 1;
            newStats.longestWinStreak = Math.max(newStats.longestWinStreak, newStats.currentStreak);
          } else if (result === 'loss') {
            newStats.losses += 1;
            newStats.currentStreak = Math.min(0, newStats.currentStreak) - 1;
            newStats.longestLossStreak = Math.max(newStats.longestLossStreak, Math.abs(newStats.currentStreak));
          } else {
            newStats.draws += 1;
            newStats.currentStreak = 0;
          }

          newStats.winRate = newStats.total > 0 ? (newStats.wins / newStats.total) * 100 : 0;
          newStats.avgGameDuration = newStats.totalPlayTime / newStats.total;

          // Time control stats
          if (!newStats.gamesByTimeControl[timeControlId]) {
            newStats.gamesByTimeControl[timeControlId] = { played: 0, won: 0 };
          }
          newStats.gamesByTimeControl[timeControlId].played += 1;
          if (result === 'win') newStats.gamesByTimeControl[timeControlId].won += 1;

          // AI level stats
          newStats.gamesVsAI[aiLevel].played += 1;
          if (result === 'win') newStats.gamesVsAI[aiLevel].won += 1;

          // Check achievements
          const updatedAchievements = profile.achievements.map((a) => {
            if (a.unlockedAt) return a;
            let shouldUnlock = false;
            switch (a.id) {
              case 'first_win':
                shouldUnlock = newStats.wins >= 1;
                break;
              case 'win_streak_3':
                shouldUnlock = newStats.currentStreak >= 3;
                break;
              case 'win_streak_10':
                shouldUnlock = newStats.currentStreak >= 10;
                break;
              case 'play_50':
                shouldUnlock = newStats.total >= 50;
                break;
              case 'play_200':
                shouldUnlock = newStats.total >= 200;
                break;
              case 'beat_expert':
                shouldUnlock = newStats.gamesVsAI.expert.won >= 1;
                break;
              case 'beat_master':
                shouldUnlock = newStats.gamesVsAI.master.won >= 1;
                break;
              case 'beat_gm':
                shouldUnlock = newStats.gamesVsAI.grandmaster.won >= 1;
                break;
            }
            return shouldUnlock ? { ...a, unlockedAt: Date.now() } : a;
          });

          return {
            profile: {
              ...profile,
              stats: newStats,
              achievements: updatedAchievements,
            },
          };
        }),

      unlockAchievement: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            achievements: state.profile.achievements.map((a) =>
              a.id === id && !a.unlockedAt ? { ...a, unlockedAt: Date.now() } : a
            ),
          },
        })),

      updateAchievementProgress: (id, progress) =>
        set((state) => ({
          profile: {
            ...state.profile,
            achievements: state.profile.achievements.map((a) =>
              a.id === id ? { ...a, progress } : a
            ),
          },
        })),

      resetProfile: () =>
        set({ profile: initialProfile }),
    }),
    {
      name: 'crystal-chess-user',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);