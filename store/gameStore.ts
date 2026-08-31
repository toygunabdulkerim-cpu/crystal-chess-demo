// Game Store - Active game state management
import { create } from 'zustand';
import { Chess, Square, Move as ChessMove } from 'chess.js';
import { GameState, Move, AIDifficulty, TimeControl, Color, PlayerInfo } from '@/types';
import { AI_LEVELS, TIME_CONTROLS, INITIAL_FEN } from '@/constants/design';

interface GameStore {
  // Current game state
  game: GameState | null;
  chess: Chess | null;
  selectedSquare: Square | null;
  legalMoves: Square[];
  lastMove: { from: Square; to: Square } | null;
  checkSquare: Square | null;
  isAITurn: boolean;
  aiThinking: boolean;
  orientation: Color;
  promotionPending: { from: Square; to: Square } | null;

  // Actions
  newGame: (white: PlayerInfo, black: PlayerInfo, timeControl: TimeControl, aiLevel?: AIDifficulty) => void;
  resumeGame: (gameState: GameState) => void;
  makeMove: (from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n') => boolean;
  undoMove: () => boolean;
  setSelectedSquare: (square: Square | null) => void;
  setOrientation: (orientation: Color) => void;
  setAITurn: (isAITurn: boolean) => void;
  setAIThinking: (thinking: boolean) => void;
  updateClocks: () => void;
  triggerAIMove: () => void;
  setPromotionPending: (pending: { from: Square; to: Square } | null) => void;
  completePromotion: (promotion: 'q' | 'r' | 'b' | 'n') => void;
  resign: () => void;
  offerDraw: () => void;
  clearGame: () => void;
}

const createInitialChess = () => new Chess(INITIAL_FEN);

const fenToBoard = (fen: string): string[][] => {
  const board: string[][] = Array(8).fill(null).map(() => Array(8).fill(''));
  const rows = fen.split(' ')[0].split('/');
  const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];
  rows.forEach((row, r) => {
    let f = 0;
    for (const char of row) {
      if (char >= '1' && char <= '8') {
        f += parseInt(char);
      } else {
        const color = char === char.toUpperCase() ? 'w' : 'b';
        const type = char.toLowerCase();
        board[r][f] = `${color}${type}`;
        f++;
      }
    }
  });
  return board;
};

const findKingSquare = (chess: Chess, color: Color): Square => {
  const board = fenToBoard(chess.fen());
  const king = color === 'w' ? 'wk' : 'bk';
  const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      if (board[r][f] === king) {
        return `${FILES[f]}${RANKS[7 - r]}` as Square;
      }
    }
  }
  return color === 'w' ? 'e1' : 'e8';
};

const evaluateMove = (chess: Chess, move: ChessMove, aiLevel: AIDifficulty): number => {
  let score = 0;
  chess.move(move);

  // Checkmate is highest priority
  if (chess.isCheckmate()) score += 10000;
  else if (chess.isCheck()) score += 500;

  // Captures
  if (move.san.includes('x')) score += 100;

  // Promotions
  if (move.promotion) score += 800;

  // Center control
  const toFile = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].indexOf(move.to[0]);
  const toRank = parseInt(move.to[1]) - 1;
  if (toFile >= 2 && toFile <= 5 && toRank >= 2 && toRank <= 5) score += 20;

  // Piece values for captures
  const pieceValues: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
  if (move.captured) {
    score += pieceValues[move.captured] || 0;
  }

  // Development bonus (early game)
  const moveNumber = Math.floor(chess.history().length / 2) + 1;
  if (moveNumber < 15) {
    // Knights and bishops development
    if (move.piece === 'n' || move.piece === 'b') score += 15;
    // Castling
    if (move.san === 'O-O' || move.san === 'O-O-O') score += 50;
  }

  // Random factor for variety (less at higher levels)
  const aiConfig = AI_LEVELS.find(l => l.id === aiLevel);
  const randomFactor = aiConfig ? (8 - aiConfig.depth) * 2 : 10;
  score += Math.random() * randomFactor;

  chess.undo();
  return score;
};

export const useGameStore = create<GameStore>((set, get) => ({
  game: null,
  chess: null,
  selectedSquare: null,
  legalMoves: [],
  lastMove: null,
  checkSquare: null,
  isAITurn: false,
  aiThinking: false,
  orientation: 'w',
  promotionPending: null,

  newGame: (white, black, timeControl, aiLevel = 'medium') => {
    const chess = createInitialChess();
    const gameId = `game_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const now = Date.now();

    const newGame: GameState = {
      id: gameId,
      fen: INITIAL_FEN,
      moves: [],
      status: 'ongoing',
      turn: 'w',
      white,
      black,
      clocks: { w: timeControl.initial, b: timeControl.initial },
      timeControl,
      startTime: now,
      lastMoveTime: now,
      orientation: 'w',
    };

    set({
      game: newGame,
      chess,
      selectedSquare: null,
      legalMoves: [],
      lastMove: null,
      checkSquare: null,
      isAITurn: false,
      aiThinking: false,
      orientation: 'w',
      promotionPending: null,
    });
  },

  resumeGame: (gameState) => {
    const chess = new Chess(gameState.fen);
    // Replay moves to get proper chess state
    for (const move of gameState.moves) {
      chess.move({ from: move.from, to: move.to, promotion: move.promotion });
    }

    set({
      game: gameState,
      chess,
      selectedSquare: null,
      legalMoves: [],
      lastMove: gameState.moves.length > 0
        ? { from: gameState.moves[gameState.moves.length - 1].from, to: gameState.moves[gameState.moves.length - 1].to }
        : null,
      checkSquare: chess.isCheck() ? findKingSquare(chess, chess.turn()) : null,
      isAITurn: gameState.turn === 'b' && !gameState.black.isHuman,
      aiThinking: false,
      orientation: gameState.orientation,
      promotionPending: null,
    });
  },

  makeMove: (from, to, promotion) => {
    const { chess, game, promotionPending } = get();
    if (!chess || !game || game.status !== 'ongoing') return false;

    // Handle promotion
    if (promotionPending && (from !== promotionPending.from || to !== promotionPending.to)) {
      return false;
    }

    const move = chess.move({
      from,
      to,
      promotion: promotionPending ? promotion : undefined,
    });

    if (!move) return false;

    const newMove: Move = {
      from,
      to,
      san: move.san,
      piece: { color: move.color as Color, type: move.piece as Move['piece']['type'] },
      captured: move.captured ? { color: move.color === 'w' ? 'b' : 'w', type: move.captured as Move['piece']['type'] } : undefined,
      promotion: move.promotion as Move['promotion'],
      isCheck: chess.isCheck(),
      isCheckmate: chess.isCheckmate(),
      isCapture: !!move.captured,
      isPromotion: !!move.promotion,
      isCastling: move.san === 'O-O' || move.san === 'O-O-O',
      beforeFen: game.fen,
      afterFen: chess.fen(),
      timestamp: Date.now(),
      timeSpent: Date.now() - game.lastMoveTime,
    };

    const newGame: GameState = {
      ...game,
      fen: chess.fen(),
      moves: [...game.moves, newMove],
      turn: chess.turn() as Color,
      lastMoveTime: Date.now(),
      status: chess.isCheckmate() ? 'checkmate' : chess.isStalemate() ? 'stalemate' : chess.isDraw() ? 'draw' : 'ongoing',
      result: chess.isCheckmate() ? (chess.turn() === 'w' ? 'b' : 'w') : chess.isDraw() ? 'draw' : undefined,
    };

    const nextIsAITurn = newGame.turn === 'b' && !newGame.black.isHuman && newGame.status === 'ongoing';

    set({
      game: newGame,
      selectedSquare: null,
      legalMoves: [],
      lastMove: { from, to },
      checkSquare: chess.isCheck() ? findKingSquare(chess, chess.turn()) : null,
      isAITurn: nextIsAITurn,
      aiThinking: false,
      promotionPending: null,
    });

    return true;
  },

  undoMove: () => {
    const { chess, game } = get();
    if (!chess || !game || game.moves.length === 0 || game.status !== 'ongoing') return false;

    // Undo two moves if playing vs AI (human + AI)
    const movesToUndo = !game.black.isHuman ? 2 : 1;
    if (game.moves.length < movesToUndo) return false;

    for (let i = 0; i < movesToUndo; i++) {
      chess.undo();
    }

    const newMoves = game.moves.slice(0, -movesToUndo);
    const newGame: GameState = {
      ...game,
      fen: chess.fen(),
      moves: newMoves,
      turn: chess.turn() as Color,
      status: 'ongoing',
      result: undefined,
      lastMoveTime: Date.now(),
    };

    const lastMove = newMoves.length > 0
      ? { from: newMoves[newMoves.length - 1].from, to: newMoves[newMoves.length - 1].to }
      : null;

    set({
      game: newGame,
      selectedSquare: null,
      legalMoves: [],
      lastMove,
      checkSquare: chess.isCheck() ? findKingSquare(chess, chess.turn()) : null,
      isAITurn: false,
      aiThinking: false,
      promotionPending: null,
    });

    return true;
  },

  setSelectedSquare: (square) => {
    const { chess, game, selectedSquare } = get();
    if (!chess || !game || game.status !== 'ongoing') return;

    if (square === selectedSquare) {
      set({ selectedSquare: null, legalMoves: [] });
      return;
    }

    const piece = chess.get(square);
    if (piece && piece.color === game.turn) {
      const moves = chess.moves({ square, verbose: true });
      set({ selectedSquare: square, legalMoves: moves.map(m => m.to as Square) });
    } else if (selectedSquare) {
      // Try to make move
      get().makeMove(selectedSquare, square);
    } else {
      set({ selectedSquare: null, legalMoves: [] });
    }
  },

  setOrientation: (orientation) => set({ orientation }),

  setAITurn: (isAITurn) => set({ isAITurn }),

  setAIThinking: (aiThinking) => set({ aiThinking }),

  updateClocks: () => {
    const { game } = get();
    if (!game || game.status !== 'ongoing') return;

    const now = Date.now();
    const elapsed = Math.floor((now - game.lastMoveTime) / 1000);
    if (elapsed <= 0) return;

    const currentTurn = game.turn;
    const newClocks = { ...game.clocks };
    newClocks[currentTurn] = Math.max(0, newClocks[currentTurn] - elapsed);

    // Check timeout
    if (newClocks[currentTurn] <= 0) {
      const result = currentTurn === 'w' ? 'b' : 'w';
      set({
        game: {
          ...game,
          clocks: newClocks,
          status: 'timeout',
          result,
          lastMoveTime: now,
        },
      });
      return;
    }

    // Add increment
    if (game.moves.length > 0) {
      const lastMove = game.moves[game.moves.length - 1];
      if (lastMove.timeSpent > 0) {
        newClocks[currentTurn] += game.timeControl.increment;
      }
    }

    set({
      game: {
        ...game,
        clocks: newClocks,
        lastMoveTime: now,
      },
    });
  },

  triggerAIMove: () => {
    const { chess, game, aiThinking } = get();
    if (!chess || !game || game.status !== 'ongoing' || aiThinking) return;

    set({ aiThinking: true });

    // Small delay for UX
    setTimeout(() => {
      const { chess: currentChess, game: currentGame } = get();
      if (!currentChess || !currentGame || currentGame.status !== 'ongoing') return;

      const aiLevel = currentGame.black.aiLevel || 'medium';
      const moves = currentChess.moves({ verbose: true });

      if (moves.length === 0) return;

      let bestMove = moves[0];
      let bestScore = -Infinity;

      for (const move of moves) {
        const score = evaluateMove(currentChess, move, aiLevel);
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }

      const { makeMove } = get();
      makeMove(bestMove.from, bestMove.to, bestMove.promotion as 'q' | 'r' | 'b' | 'n');
      set({ aiThinking: false });
    }, 300);
  },

  setPromotionPending: (pending) => set({ promotionPending: pending }),

  completePromotion: (promotion) => {
    const { promotionPending, makeMove } = get();
    if (!promotionPending) return;
    makeMove(promotionPending.from, promotionPending.to, promotion);
  },

  resign: () => {
    const { game } = get();
    if (!game || game.status !== 'ongoing') return;

    set({
      game: {
        ...game,
        status: 'resigned',
        result: game.turn === 'w' ? 'b' : 'w',
      },
    });
  },

  offerDraw: () => {
    const { game } = get();
    if (!game || game.status !== 'ongoing') return;

    // In single player, auto-accept draw
    set({
      game: {
        ...game,
        status: 'draw',
        result: 'draw',
      },
    });
  },

  clearGame: () => set({
    game: null,
    chess: null,
    selectedSquare: null,
    legalMoves: [],
    lastMove: null,
    checkSquare: null,
    isAITurn: false,
    aiThinking: false,
    orientation: 'w',
    promotionPending: null,
  }),

  // Computed getters
  get isPlayerTurn() {
    const { game } = get();
    return game && game.turn === 'w' && game.status === 'ongoing';
  },

  get canUndo() {
    const { game } = get();
    return game && game.moves.length > 0 && game.status === 'ongoing';
  },
}));