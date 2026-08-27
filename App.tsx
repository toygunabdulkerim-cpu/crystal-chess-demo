import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Chess, Square } from 'chess.js';

// Theme colors
const COLORS = {
  background: '#0a0a0f',
  surface: '#11121a',
  surfaceElevated: '#16171f',
  border: '#2a2b3a',
  text: '#f0f0f5',
  textMuted: '#6b6b7a',
  accent: '#00d4ff',
  accentDim: 'rgba(0, 212, 255, 0.2)',
  highlight: 'rgba(0, 212, 255, 0.3)',
  check: 'rgba(255, 107, 157, 0.6)',
  lastMove: 'rgba(0, 212, 255, 0.4)',
  pieceWhite: '#f5f5f5',
  pieceBlack: '#1a1a1a',
  squareLight: 'rgba(255, 255, 255, 0.03)',
  squareDark: 'rgba(0, 0, 0, 0.2)',
  grid: 'rgba(0, 212, 255, 0.08)',
};

// Piece Unicode symbols
const PIECES = {
  w: { p: '♙', n: '♘', b: '♗', r: '♖', q: '♕', k: '♔' },
  b: { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚' },
};

// Initial board
const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

function squareToCoords(square: string, orientation: 'w' | 'b', squareSize: number) {
  const file = FILES.indexOf(square[0]);
  const rank = RANKS.indexOf(square[1]);
  const displayFile = orientation === 'w' ? file : 7 - file;
  const displayRank = orientation === 'w' ? 7 - rank : rank;
  return {
    x: displayFile * squareSize + squareSize / 2,
    y: displayRank * squareSize + squareSize / 2,
    col: displayFile,
    row: displayRank,
  };
}

function coordsToSquare(x: number, y: number, orientation: 'w' | 'b', squareSize: number) {
  const file = Math.floor(x / squareSize);
  const rank = Math.floor(y / squareSize);
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;
  const displayFile = orientation === 'w' ? file : 7 - file;
  const displayRank = orientation === 'w' ? 7 - rank : rank;
  return `${FILES[displayFile]}${RANKS[displayRank]}`;
}

export default function App() {
  const [chess] = React.useState(() => new Chess(INITIAL_FEN));
  const [board, setBoard] = React.useState<string[][]>(() => fenToBoard(chess.fen()));
  const [turn, setTurn] = React.useState<'w' | 'b'>('w');
  const [selectedSquare, setSelectedSquare] = React.useState<string | null>(null);
  const [legalMoves, setLegalMoves] = React.useState<string[]>([]);
  const [lastMove, setLastMove] = React.useState<{ from: string; to: string } | null>(null);
  const [check, setCheck] = React.useState<string | null>(null);
  const [gameStatus, setGameStatus] = React.useState<'ongoing' | 'checkmate' | 'stalemate' | 'draw'>('ongoing');
  const [orientation, setOrientation] = React.useState<'w' | 'b'>('w');
  const [aiThinking, setAiThinking] = React.useState(false);
  const [clocks, setClocks] = React.useState({ w: 600, b: 600 });
  const [aiLevel, setAiLevel] = React.useState(3);

  // AI Levels
  const AI_LEVELS = [
    { name: 'Başlangıç', depth: 1 },
    { name: 'Yeni Başlayan', depth: 2 },
    { name: 'Hobi', depth: 3 },
    { name: 'Kulüp', depth: 4 },
    { name: 'Deneyimli', depth: 5 },
    { name: 'Uzman', depth: 6 },
    { name: 'Usta', depth: 7 },
    { name: 'Großmeister', depth: 8 },
  ];

  // Initialize
  React.useEffect(() => {
    updateLegalMoves();
    updateCheck();
  }, []);

  // Timer
  React.useEffect(() => {
    if (gameStatus !== 'ongoing') return;
    const interval = setInterval(() => {
      setClocks(prev => {
        const currentTurn = turn;
        const newTime = prev[currentTurn] - 1;
        if (newTime <= 0) {
          clearInterval(interval);
          setGameStatus('draw');
          return prev;
        }
        return { ...prev, [currentTurn]: newTime };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [turn, gameStatus]);

  function fenToBoard(fen: string): string[][] {
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
  }

  function updateBoard() {
    setBoard(fenToBoard(chess.fen()));
    setTurn(chess.turn() as 'w' | 'b');
    updateLegalMoves();
    updateCheck();
    updateGameStatus();
  }

  function updateLegalMoves() {
    if (selectedSquare) {
      const moves = chess.moves({ square: selectedSquare as Square, verbose: true });
      setLegalMoves(moves.map(m => m.to));
    } else {
      setLegalMoves([]);
    }
  }

  function updateCheck() {
    if (chess.isCheck()) {
      const kingSquare = findKingSquare(chess.turn() as 'w' | 'b');
      setCheck(kingSquare);
    } else {
      setCheck(null);
    }
  }

  function findKingSquare(color: 'w' | 'b'): string {
    const fen = chess.fen();
    const board = fenToBoard(fen);
    const king = color === 'w' ? 'wk' : 'bk';
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        if (board[r][f] === king) {
          return `${FILES[f]}${RANKS[7 - r]}`;
        }
      }
    }
    return color === 'w' ? 'e1' : 'e8';
  }

  function updateGameStatus() {
    if (chess.isCheckmate()) setGameStatus('checkmate');
    else if (chess.isStalemate()) setGameStatus('stalemate');
    else if (chess.isDraw()) setGameStatus('draw');
    else setGameStatus('ongoing');
  }

  function handleSquarePress(square: string) {
    if (gameStatus !== 'ongoing' || aiThinking) return;
    if (turn === 'b') return; // Human plays white only in demo

    const piece = board[7 - RANKS.indexOf(square[1])][FILES.indexOf(square[0])];
    
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }
    
    if (selectedSquare) {
      const isLegal = legalMoves.includes(square);
      if (isLegal) {
        makeMove(selectedSquare, square);
      }
      setSelectedSquare(null);
      setLegalMoves([]);
    } else if (piece && piece[0] === turn) {
      setSelectedSquare(square);
      updateLegalMoves();
    }
  }

  function makeMove(from: string, to: string, promotion?: string) {
    const move = chess.move({ from: from as Square, to: to as Square, promotion: promotion as any });
    if (!move) return;
    
    setLastMove({ from, to });
    updateBoard();
    
    // AI move after human
    if (turn === 'b' && gameStatus === 'ongoing') {
      setAiThinking(true);
      setTimeout(() => makeAIMove(), 300);
    }
  }

  function makeAIMove() {
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) return;
    
    // Simple AI evaluation
    let bestMove = moves[0];
    let bestScore = -Infinity;
    
    for (const move of moves) {
      let score = 0;
      chess.move(move);
      
      if (chess.isCheckmate()) score += 10000;
      else if (chess.isCheck()) score += 500;
      if (move.san.includes('x')) score += 100;
      if (move.promotion) score += 800;
      
      // Center control
      const toFile = FILES.indexOf(move.to[0]);
      const toRank = parseInt(move.to[1]) - 1;
      if (toFile >= 2 && toFile <= 5 && toRank >= 2 && toRank <= 5) score += 20;
      
      score += Math.random() * 10;
      chess.undo();
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    
    makeMove(bestMove.from, bestMove.to, bestMove.promotion);
    setAiThinking(false);
  }

  function handleNewGame() {
    chess.reset();
    setBoard(fenToBoard(chess.fen()));
    setTurn('w');
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setCheck(null);
    setGameStatus('ongoing');
    setClocks({ w: 600, b: 600 });
    setAiThinking(false);
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function getStatusText() {
    if (gameStatus === 'checkmate') {
      return `${turn === 'w' ? 'Siyah' : 'Beyaz'} kazandı! (Mat)`;
    }
    if (gameStatus === 'stalemate') return 'Pat - Berabere';
    if (gameStatus === 'draw') return 'Berabere';
    if (check) return `${turn === 'w' ? 'Beyaz' : 'Siyah'} sırası - ŞAH!`;
    return `${turn === 'w' ? 'Beyaz' : 'Siyah'} sırası${aiThinking ? ' (AI düşünüyor...)' : ''}`;
  }

  const size = Math.min(340, 320);
  const squareSize = size / 8;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Crystal Chess</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      {/* Chess Board */}
      <View style={styles.boardContainer}>
        <View style={{ width: size, height: size }}>
          {board.map((row, r) =>
            row.map((cell, f) => {
              const square = `${FILES[f]}${RANKS[7 - r]}`;
              const coords = squareToCoords(square, orientation, squareSize);
              const isSelected = selectedSquare === square;
              const isLegal = legalMoves.includes(square);
              const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
              const isCheckSquare = check === square;
              
              let bgColor = (coords.col + coords.row) % 2 === 0 ? COLORS.squareLight : COLORS.background;
              if (isLastMove) bgColor = COLORS.lastMove;
              if (isCheckSquare) bgColor = COLORS.check;
              if (isSelected) bgColor = COLORS.highlight;
              
              return (
                <TouchableOpacity
                  key={square}
                  style={[
                    styles.square,
                    { 
                      width: squareSize, 
                      height: squareSize,
                      backgroundColor: bgColor,
                      borderWidth: isSelected ? 2 : 0,
                      borderColor: COLORS.accent,
                    }
                  ]}
                  onPress={() => handleSquarePress(square)}
                  activeOpacity={0.8}
                >
                  {isLegal && !cell && (
                    <View style={styles.legalMoveDot} />
                  )}
                  {cell && (
                    <Text style={[
                      styles.piece,
                      { color: cell[0] === 'w' ? COLORS.pieceWhite : COLORS.pieceBlack }
                    ]}>
                      {PIECES[cell[0] as 'w' | 'b'][cell[1] as keyof typeof PIECES['w']]}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.controlRow}>
          <Text style={styles.clock}>♕ {formatTime(clocks.w)}</Text>
          <Text style={styles.aiIndicator}>
            {aiThinking ? '🤔 AI düşünüyor...' : turn === 'b' ? '🤖 AI sırası' : ''}
          </Text>
          <Text style={styles.clock}>♛ {formatTime(clocks.b)}</Text>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleNewGame} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Yeni Oyun</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setOrientation(o => o === 'w' ? 'b' : 'w')} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Tahtayı Çevir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.aiLevelContainer}>
          <Text style={styles.aiLevelLabel}>AI Seviyesi: {AI_LEVELS[aiLevel].name}</Text>
          <View style={styles.aiLevelButtons}>
            {AI_LEVELS.map((level, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.aiLevelButton,
                  aiLevel === i && styles.aiLevelButtonActive
                ]}
                onPress={() => setAiLevel(i)}
                activeOpacity={0.8}
              >
                <Text style={styles.aiLevelButtonText}>{i + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.accent,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  statusContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  square: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalMoveDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
    opacity: 0.6,
  },
  piece: {
    fontSize: 36,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  controls: {
    padding: 20,
    paddingBottom: 40,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  clock: {
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: '500',
    color: COLORS.accent,
  },
  aiIndicator: {
    fontSize: 14,
    color: '#ff6b9d',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    flex: 1,
  },
  buttonBase: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  aiLevelContainer: {
    marginTop: 16,
  },
  aiLevelLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 8,
    textAlign: 'center',
  },
  aiLevelButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  aiLevelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 40,
    alignItems: 'center',
  },
  aiLevelButtonActive: {
    backgroundColor: COLORS.accentDim,
    borderColor: COLORS.accent,
  },
  aiLevelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
});