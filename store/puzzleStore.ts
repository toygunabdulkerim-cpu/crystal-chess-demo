// Puzzle Store
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Puzzle, PuzzleProgress } from '@/types';

const PUZZLES: Puzzle[] = [
  {
    id: 'p1',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    solution: ['c4', 'e5'],
    rating: 800,
    themes: ['opening', 'tactics'],
    description: 'İtalyan Oyunası - Beyaz hamle yapıyor',
    hint: 'Merkezi kontrol et',
  },
  {
    id: 'p2',
    fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
    solution: ['e4', 'd5', 'exd5', 'Qxd5'],
    rating: 900,
    themes: ['opening', 'center'],
    description: 'Skandinav Savunması - Beyazın cevabı',
    hint: 'Piyonu al',
  },
  {
    id: 'p3',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    solution: ['d5', 'exd5', 'Nxd5'],
    rating: 1000,
    themes: ['tactics', 'fork'],
    description: 'İki at çatalı fırsatı',
    hint: 'At ile çatal yap',
  },
  {
    id: 'p4',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 5',
    solution: ['Nxe5', 'Nxe5', 'd4'],
    rating: 1100,
    themes: ['tactics', 'pin'],
    description: 'Pin ve merkez kontrolü',
    hint: 'Atı al, sonra piyon ilerle',
  },
  {
    id: 'p5',
    fen: 'r1bq1rk1/ppp2ppp/2np1n2/4p3/2B1P3/2P2N2/PP1P1PPP/RNBQ1RK1 w - - 6 7',
    solution: ['Bxh7+', 'Kxh7', 'Ng5+', 'Kg8', 'Qh5', 'Re8', 'Qxf7#'],
    rating: 1400,
    themes: ['mate', 'sacrifice'],
    description: 'Klasik İtalyan mat şablonu',
    hint: 'Fil kurban et',
  },
  {
    id: 'p6',
    fen: 'r2q1rk1/ppp2ppp/2npb3/4p3/2B1P3/2P2N2/PP1P1PPP/R1BQ1RK1 w - - 0 8',
    solution: ['Bxh7+', 'Kxh7', 'Ng5+', 'Kg6', 'h4', 'gxh4', 'Qg4#'],
    rating: 1500,
    themes: ['mate', 'attack'],
    description: 'h-file saldırısı',
    hint: 'Kralı h-file\'a çek',
  },
  {
    id: 'p7',
    fen: 'r1bq1rk1/ppp2pp1/2n2np1/4p3/2B1P3/2P2N1P/PP1P1PP1/R1BQ1RK1 w - - 0 9',
    solution: ['Nxf7', 'Kxf7', 'Qh5+', 'Ke7', 'Qxh7'],
    rating: 1300,
    themes: ['tactics', 'knight'],
    description: 'f7 noktası üzerinde at kurbanı',
    hint: 'Atı f7\'ye gönder',
  },
  {
    id: 'p8',
    fen: 'r1bq1rk1/ppp2ppp/2n2n2/4p1B1/2B1P3/2P2N2/PP1P1PPP/R2Q1RK1 w - - 0 9',
    solution: ['Bxh7+', 'Kxh7', 'Ng5+', 'Kg8', 'Qh5', 'Re8', 'Qxf7#'],
    rating: 1600,
    themes: ['mate', 'bishop_sacrifice'],
    description: 'Yunanca Kurban (Greek Gift)',
    hint: 'Fili h7\'ye kurban et',
  },
  {
    id: 'p9',
    fen: 'r2q1rk1/ppp1bppp/2n2n2/3pp3/3PP3/2P2N2/PP1N1PPP/R1BQ1RK1 w - - 0 10',
    solution: ['d5', 'exd5', 'Nxd5', 'Nxd5', 'Bxd5'],
    rating: 1200,
    themes: ['tactics', 'center'],
    description: 'Merkezde piyon kırılımı',
    hint: 'd5 ile merkez kır',
  },
  {
    id: 'p10',
    fen: 'r1bq1rk1/ppp2pp1/2np1n1p/4p3/2B1P3/2P2N1P/PP1P1PP1/R1BQ1RK1 w - - 0 10',
    solution: ['Nxe5', 'Nxe5', 'd4', 'exd4', 'Qxd4'],
    rating: 1100,
    themes: ['tactics', 'queen'],
    description: 'Merkez kontrolü ve Vezir aktivitesi',
    hint: 'Atı al, sonra piyon it',
  },
  // Add more puzzles...
  {
    id: 'p11',
    fen: 'r2q1rk1/ppp1bppp/2n1pn2/3p4/3PP1b1/2P2N2/PP1N1PPP/R1BQR1K1 w - - 0 11',
    solution: ['Bxh7+', 'Kxh7', 'Ng5+', 'Kg8', 'Qh5', 'Re8', 'Qxf7#'],
    rating: 1700,
    themes: ['mate', 'pattern'],
    description: 'Gelişmiş Yunanca Kurban',
    hint: 'Aynı desen, farklı pozisyon',
  },
  {
    id: 'p12',
    fen: 'r1bq1rk1/ppp2ppp/2np1n2/4p1B1/2B1P3/2P2N2/PP1P1PPP/R2Q1RK1 w - - 0 10',
    solution: ['Bxh7+', 'Kxh7', 'Ng5+', 'Kg8', 'Qh5', 'Re8', 'Qxf7#'],
    rating: 1650,
    themes: ['mate', 'classic'],
    description: 'Klasik mat deseni',
    hint: 'h7\'yi hedef al',
  },
];

interface PuzzleStore {
  puzzles: Puzzle[];
  progress: PuzzleProgress;
  currentPuzzle: Puzzle | null;
  isSolving: boolean;
  showSolution: boolean;
  attempts: number;

  // Actions
  loadPuzzle: (puzzleId?: string) => void;
  nextPuzzle: () => void;
  previousPuzzle: () => void;
  makeMove: (from: string, to: string) => boolean;
  useHint: () => string | null;
  toggleSolution: () => void;
  resetPuzzle: () => void;
  giveUp: () => void;
}

const initialProgress: PuzzleProgress = {
  currentPuzzleIndex: 0,
  solved: [],
  failed: [],
  streak: 0,
  totalSolved: 0,
  rating: 800,
};

export const usePuzzleStore = create<PuzzleStore>()(
  persist(
    (set, get) => ({
      puzzles: PUZZLES,
      progress: initialProgress,
      currentPuzzle: PUZZLES[0],
      isSolving: false,
      showSolution: false,
      attempts: 0,

      loadPuzzle: (puzzleId) => {
        const { puzzles, progress } = get();
        let puzzle = puzzles.find(p => p.id === puzzleId);
        if (!puzzle) {
          puzzle = puzzles[progress.currentPuzzleIndex] || puzzles[0];
        }
        const index = puzzles.findIndex(p => p.id === puzzle.id);
        set({
          currentPuzzle: puzzle,
          isSolving: true,
          showSolution: false,
          attempts: 0,
          progress: { ...progress, currentPuzzleIndex: index >= 0 ? index : 0 },
        });
      },

      nextPuzzle: () => {
        const { puzzles, progress } = get();
        const nextIndex = Math.min(progress.currentPuzzleIndex + 1, puzzles.length - 1);
        const puzzle = puzzles[nextIndex];
        set({
          currentPuzzle: puzzle,
          isSolving: true,
          showSolution: false,
          attempts: 0,
          progress: { ...progress, currentPuzzleIndex: nextIndex },
        });
      },

      previousPuzzle: () => {
        const { puzzles, progress } = get();
        const prevIndex = Math.max(progress.currentPuzzleIndex - 1, 0);
        const puzzle = puzzles[prevIndex];
        set({
          currentPuzzle: puzzle,
          isSolving: true,
          showSolution: false,
          attempts: 0,
          progress: { ...progress, currentPuzzleIndex: prevIndex },
        });
      },

      makeMove: (from, to) => {
        const { currentPuzzle, progress, attempts } = get();
        if (!currentPuzzle || !progress) return false;

        const solution = currentPuzzle.solution;
        const expectedMove = `${from}${to}`;
        const currentStep = Math.floor(attempts / 2);

        if (currentStep >= solution.length - 1) return false;

        const expectedFrom = solution[currentStep * 2];
        const expectedTo = solution[currentStep * 2 + 1];

        const isCorrect = from === expectedFrom && to === expectedTo;

        if (isCorrect) {
          const newAttempts = attempts + 1;
          // Check if puzzle completed
          if (newAttempts >= solution.length) {
            const solved = progress.solved.includes(currentPuzzle.id);
            const newSolved = solved ? progress.solved : [...progress.solved, currentPuzzle.id];
            const newStreak = solved ? progress.streak : progress.streak + 1;
            const newRating = Math.min(2800, progress.rating + 10 + Math.floor(newStreak / 3) * 5);

            set({
              isSolving: false,
              showSolution: true,
              attempts: newAttempts,
              progress: {
                ...progress,
                solved: newSolved,
                streak: newStreak,
                totalSolved: newSolved.length,
                rating: newRating,
              },
            });
          } else {
            set({ attempts: newAttempts });
          }
          return true;
        } else {
          // Wrong move
          const newFailed = progress.failed.includes(currentPuzzle.id)
            ? progress.failed
            : [...progress.failed, currentPuzzle.id];

          set({
            attempts: 0,
            progress: { ...progress, failed: newFailed, streak: 0 },
          });
          return false;
        }
      },

      useHint: () => {
        const { currentPuzzle, attempts } = get();
        if (!currentPuzzle) return null;
        const currentStep = Math.floor(attempts / 2);
        if (currentStep >= currentPuzzle.solution.length - 1) return null;
        return currentPuzzle.hint || `Hamle: ${currentPuzzle.solution[currentStep * 2]}${currentPuzzle.solution[currentStep * 2 + 1]}`;
      },

      toggleSolution: () => set((state) => ({ showSolution: !state.showSolution })),

      resetPuzzle: () => {
        const { currentPuzzle } = get();
        if (currentPuzzle) {
          set({ isSolving: true, showSolution: false, attempts: 0 });
        }
      },

      giveUp: () => {
        const { currentPuzzle, progress } = get();
        if (!currentPuzzle) return;

        const newFailed = progress.failed.includes(currentPuzzle.id)
          ? progress.failed
          : [...progress.failed, currentPuzzle.id];

        set({
          isSolving: false,
          showSolution: true,
          attempts: 0,
          progress: { ...progress, failed: newFailed, streak: 0 },
        });
      },
    }),
    {
      name: 'crystal-chess-puzzles',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);