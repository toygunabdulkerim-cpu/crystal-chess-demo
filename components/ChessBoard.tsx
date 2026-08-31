// Chess Board Component
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Chess, Square } from 'chess.js';
import { COLORS, FILES, RANKS, PIECE_SYMBOLS, BORDER_RADIUS, SHADOWS } from '@/constants/design';
import { useGameStore } from '@/store/gameStore';
import { useSettingsStore } from '@/store/settingsStore';
import { squareToCoords } from '@/utils/helpers';

interface ChessBoardProps {
  size?: number;
  interactive?: boolean;
  fen?: string;
  showCoordinates?: boolean;
  lastMove?: { from: Square; to: Square } | null;
  selectedSquare?: Square | null;
  legalMoves?: Square[];
  checkSquare?: Square | null;
  onSquarePress?: (square: Square) => void;
  orientation?: 'w' | 'b';
}

const fenToBoard = (fen: string): string[][] => {
  const board: string[][] = Array(8).fill(null).map(() => Array(8).fill(''));
  const rows = fen.split(' ')[0].split('/');
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

// Crystal-styled piece rendering with glow effects
const PieceIcon = ({ code, cell, size }: { code: string; cell: string; size: number }) => {
  const color = cell[0] === 'w' ? COLORS.pieceWhite : '#d0b060';
  const isWhite = cell[0] === 'w';
  const type = cell[1] as keyof typeof PIECE_SYMBOLS.w;
  const symbol = PIECE_SYMBOLS[isWhite ? 'w' : 'b'][type];
  const fontSize = size * 0.72;

  return (
    <Text
      style={{
        fontSize,
        color,
        textShadowColor: isWhite ? 'rgba(0, 212, 255, 0.6)' : 'rgba(212, 168, 67, 0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: isWhite ? size * 0.06 : size * 0.05,
        textAlign: 'center',
        fontWeight: '500',
      }}
    >
      {symbol}
    </Text>
  );
};

export const ChessBoard: React.FC<ChessBoardProps> = ({
  size = 320,
  interactive = true,
  fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  showCoordinates = true,
  lastMove,
  selectedSquare,
  legalMoves,
  checkSquare,
  onSquarePress,
  orientation = 'w',
}) => {
  const board = useMemo(() => fenToBoard(fen), [fen]);
  const { settings } = useSettingsStore();
  const squareSize = size / 8;

  const getSquareBg = (row: number, col: number, square: Square): string => {
    const isLight = (row + col) % 2 === 0;
    let base = isLight ? COLORS.squareLight : COLORS.squareDark;

    if (settings.boardTheme === 'gold') {
      base = isLight ? COLORS.squareLightAlt : COLORS.squareDarkAlt;
    } else if (settings.boardTheme === 'crystal') {
      base = isLight ? 'rgba(0, 212, 255, 0.03)' : 'rgba(0, 212, 255, 0.10)';
    }

    if (checkSquare === square) return COLORS.check;
    if (lastMove && (lastMove.from === square || lastMove.to === square)) return COLORS.lastMove;
    if (selectedSquare === square) return COLORS.selected;
    if (legalMoves?.includes(square)) return COLORS.legalMove;
    return base;
  };

  const handlePress = (square: Square) => {
    if (!interactive) return;
    onSquarePress?.(square);
  };

  return (
    <View
      style={[
        styles.board,
        {
          width: size,
          height: size,
          borderRadius: BORDER_RADIUS.lg,
          ...SHADOWS.gold,
        },
      ]}
    >
      {board.map((row, r) =>
        row.map((cell, f) => {
          const displayCol = orientation === 'w' ? f : 7 - f;
          const displayRow = orientation === 'w' ? r : 7 - r;
          const square = `${FILES[displayCol]}${RANKS[7 - displayRow]}`;
          const isFileLabel = r === 7;
          const isRankLabel = f === 0;

          return (
            <TouchableOpacity
              key={square}
              style={[
                styles.square,
                {
                  width: squareSize,
                  height: squareSize,
                  backgroundColor: getSquareBg(r, displayCol, square as Square),
                },
              ]}
              onPress={() => handlePress(square as Square)}
              activeOpacity={interactive ? 0.7 : 1}
            >
              {/* Coordinates */}
              {isFileLabel && showCoordinates && (
                <Text style={[styles.coordFile, { color: displayCol % 2 !== 0 ? COLORS.textMuted : COLORS.textSecondary }]}>
                  {FILES[displayCol]}
                </Text>
              )}
              {isRankLabel && showCoordinates && (
                <Text style={[styles.coordRank, { color: r % 2 !== 0 ? COLORS.textMuted : COLORS.textSecondary }]}>
                  {RANKS[7 - displayRow]}
                </Text>
              )}

              {/* Legal move dot */}
              {legalMoves?.includes(square as Square) && !cell && <View style={styles.legalDot} />}
              {legalMoves?.includes(square as Square) && cell && (
                <View style={styles.captureRing} />
              )}

              {/* Piece */}
              {cell && (
                <PieceIcon code={`${cell[0]}${cell[1]}`} cell={cell} size={squareSize} />
              )}
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderGold,
    backgroundColor: COLORS.squareDark,
  },
  square: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  coordFile: {
    position: 'absolute',
    right: 3,
    bottom: 2,
    fontSize: 9,
    fontWeight: '600',
  },
  coordRank: {
    position: 'absolute',
    left: 3,
    top: 2,
    fontSize: 9,
    fontWeight: '600',
  },
  legalDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.crystal,
    opacity: 0.6,
  },
  captureRing: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.crystal,
    opacity: 0.5,
    position: 'absolute',
  },
});