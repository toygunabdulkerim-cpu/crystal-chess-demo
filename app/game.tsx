// Game Screen
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Chess, Square } from 'chess.js';
import { useGameStore } from '@/store/gameStore';
import { useUserStore } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';
import { Screen } from '@/components/Screen';
import { Button, Badge, Card, Modal } from '@/components';
import { ChessBoard } from '@/components/ChessBoard';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY, ANIMATION, FILES, RANKS } from '@/constants/design';
import { formatTime } from '@/utils/helpers';

export default function GameScreen() {
  const router = useRouter();
  const {
    game,
    chess,
    selectedSquare,
    legalMoves,
    lastMove,
    checkSquare,
    isAITurn,
    aiThinking,
    orientation,
    setOrientation,
    undoMove,
    makeMove,
    resign,
    offerDraw,
    promotionPending,
    updateClocks,
  } = useGameStore();
  const { profile, addGameResult } = useUserStore();
  const { settings } = useSettingsStore();
  
  const isPlayerTurn = game && game.turn === 'w' && game.status === 'ongoing';
  const canUndo = game && game.moves.length > 0 && game.status === 'ongoing';

  const [showResultModal, setShowResultModal] = React.useState(false);
  const [moveHistory, setMoveHistory] = React.useState<string[]>([]);

  // Sync move history
  useEffect(() => {
    if (game) {
      const history = game.moves.map(m => m.san);
      setMoveHistory(history);
    }
  }, [game?.moves]);

  // Handle game end
  useEffect(() => {
    if (game && game.status !== 'ongoing' && !showResultModal) {
      // Calculate result from player perspective (white)
      let result: 'win' | 'loss' | 'draw';
      if (game.result === 'draw') result = 'draw';
      else if (game.result === 'w') result = 'win';
      else result = 'loss';

      addGameResult(result, game.black.aiLevel as any, Math.floor((Date.now() - game.startTime) / 1000), game.timeControl.id);
      setShowResultModal(true);
    }
  }, [game?.status, showResultModal, addGameResult]);

  // Clock update
  useEffect(() => {
    if (!game || game.status !== 'ongoing') return;
    const interval = setInterval(() => updateClocks(), 1000);
    return () => clearInterval(interval);
  }, [game, updateClocks]);

  if (!game || !chess) {
    return (
      <Screen style={styles.screen}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Oyun yükleniyor...</Text>
        </View>
      </Screen>
    );
  }

  const whiteTime = game.clocks.w;
  const blackTime = game.clocks.b;
  const isWhiteTurn = game.turn === 'w';
  const statusText = getStatusText();

  return (
    <Screen style={styles.screen}>
      <View style={styles.gameContainer}>
        {/* Header with clocks */}
        <View style={styles.header}>
          {/* Black clock (top) */}
          <View style={styles.clockContainer}>
            <View style={styles.clockRow}>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{game.black.name}</Text>
                <Text style={styles.playerElo}>~{game.black.elo} ELO</Text>
              </View>
              <View style={[
                styles.clock,
                isWhiteTurn ? {} : { borderColor: COLORS.gold, borderWidth: 2 },
              ]}>
                <Text style={styles.clockTime}>{formatTime(blackTime)}</Text>
              </View>
            </View>
          </View>

          {/* Game status */}
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: isAITurn ? COLORS.gold : COLORS.textPrimary }]}>
              {statusText}
            </Text>
            {aiThinking && <Text style={styles.aiThinking}>🤔 AI düşünüyor...</Text>}
          </View>

          {/* White clock (bottom) */}
          <View style={styles.clockContainer}>
            <View style={styles.clockRow}>
              <View style={[
                styles.clock,
                isWhiteTurn ? { borderColor: COLORS.gold, borderWidth: 2 } : {},
              ]}>
                <Text style={styles.clockTime}>{formatTime(whiteTime)}</Text>
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{game.white.name}</Text>
                <Text style={styles.playerElo}>{game.white.elo} ELO</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Chess Board */}
        <View style={styles.boardContainer}>
          <ChessBoard
            size={Math.min(340, 320)}
            interactive={isPlayerTurn}
            fen={game.fen}
            showCoordinates={settings.showCoordinates}
            lastMove={lastMove}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            checkSquare={checkSquare}
            onSquarePress={handleSquarePress}
            orientation={orientation}
          />
        </View>

        {/* Move History */}
        <View style={styles.historyContainer}>
          <ScrollView horizontal style={styles.historyScroll} showsHorizontalScrollIndicator={false}>
            <View style={styles.historyContent}>
              {moveHistory.map((san, index) => {
                const moveNumber = Math.floor(index / 2) + 1;
                const isWhiteMove = index % 2 === 0;
                return (
                  <View key={index} style={styles.moveItem}>
                    {isWhiteMove && <Text style={styles.moveNumber}>{moveNumber}.</Text>}
                    <TouchableOpacity
                      style={styles.moveText}
                      onPress={() => {
                        // Navigate to move (would need game replay)
                      }}
                    >
                      <Text style={[
                        styles.moveSan,
                        isWhiteMove ? { color: COLORS.textPrimary } : { color: COLORS.gold },
                      ]}>
                        {san}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <View style={styles.controlRow}>
            <Button
              title={canUndo ? 'Geri Al' : 'Yeni Oyun'}
              onPress={canUndo ? undoMove : () => router.replace('/new-game')}
              variant={canUndo ? 'secondary' : 'outline'}
              size="sm"
              disabled={!canUndo && game.status !== 'ongoing'}
            />
            <Button
              title="Tahtayı Çevir"
              onPress={() => setOrientation(orientation === 'w' ? 'b' : 'w')}
              variant="outline"
              size="sm"
            />
            <Button
              title="Pes Et"
              onPress={resign}
              variant="outline"
              size="sm"
              style={{ borderColor: COLORS.loss }}
              disabled={game.status !== 'ongoing'}
            />
            <Button
              title="Berabere Teklif"
              onPress={offerDraw}
              variant="outline"
              size="sm"
              style={{ borderColor: COLORS.draw }}
              disabled={game.status !== 'ongoing'}
            />
          </View>
        </View>
      </View>

      <Modal visible={showResultModal} onClose={() => setShowResultModal(false)}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Oyun Bitti</Text>
          </View>
          <View style={styles.modalResult}>
            <Badge
              variant={
                game.result === 'w' ? 'success' :
                game.result === 'b' ? 'error' : 'warning'
              }
              size="md"
            >
              {game.result === 'draw' ? '½-½ Berabere' : game.result === 'w' ? '1-0 Beyaz Kazandı' : '0-1 Siyah Kazandı'}
            </Badge>
          </View>
          <View style={styles.modalDetails}>
            <Text style={styles.modalDetail}>
              {game.white.name} {game.result === 'w' ? <Text style={{ color: COLORS.gold }}>🏆</Text> : null}
            </Text>
            <Text style={styles.modalDetail}>
              {game.black.name} {game.result === 'b' ? <Text style={{ color: COLORS.gold }}>🏆</Text> : null}
            </Text>
            <Text style={styles.modalDetail}>
              Süre: {Math.floor((Date.now() - game.startTime) / 1000)}s
            </Text>
            <Text style={styles.modalDetail}>
              Hamle: {game.moves.length}
            </Text>
          </View>
          <View style={styles.modalButtons}>
            <Button
              title="Yeniden Oyna"
              onPress={() => {
                setShowResultModal(false);
                router.replace('/new-game');
              }}
              variant="gold"
              size="md"
            />
            <Button
              title="Ana Sayfa"
              onPress={() => {
                setShowResultModal(false);
                router.replace('/(tabs)/home');
              }}
              variant="outline"
              size="md"
            />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const getStatusText = () => {
  const { game, checkSquare, aiThinking } = useGameStore.getState();
  if (!game) return '';
  if (game.status === 'checkmate') return `${game.result === 'w' ? 'Beyaz' : 'Siyah'} kazandı! (Mat)`;
  if (game.status === 'stalemate') return 'Pat - Berabere';
  if (game.status === 'draw') return 'Berabere';
  if (game.status === 'timeout') return `${game.turn === 'w' ? 'Beyaz' : 'Siyah'} süresi doldu!`;
  if (game.status === 'resigned') return `${game.turn === 'w' ? 'Beyaz' : 'Siyah'} pes etti!`;
  if (checkSquare) return `${game.turn === 'w' ? 'Beyaz' : 'Siyah'} sırası - ŞAH!`;
  return `${game.turn === 'w' ? 'Beyaz' : 'Siyah'} sırası${aiThinking ? ' (AI düşünüyor...)' : ''}`;
};

const handleSquarePress = (square: Square) => {
  const { game, selectedSquare, legalMoves, makeMove, setSelectedSquare } = useGameStore.getState();
  if (!game || game.status !== 'ongoing') return;
  if (game.turn === 'b' && !game.black.isHuman) return;

  if (selectedSquare === square) {
    setSelectedSquare(null);
    return;
  }

  if (selectedSquare) {
    const isLegal = legalMoves.includes(square);
    if (isLegal) {
      makeMove(selectedSquare, square);
    }
    setSelectedSquare(null);
  } else {
    const board = game.fen.split(' ')[0].split('/');
    // Simplified piece check
    setSelectedSquare(square);
  }
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  gameContainer: { flex: 1, paddingHorizontal: SPACING.md, gap: SPACING.md },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { ...TYPOGRAPHY.bodyLarge, color: COLORS.textMuted },
  header: { flexDirection: 'column', gap: SPACING.md },
  clockContainer: { alignItems: 'center' },
  clockRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  playerInfo: { alignItems: 'flex-end', flex: 1 },
  playerName: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textPrimary },
  playerElo: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted },
  clock: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.bgSurface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 70,
    alignItems: 'center',
  },
  clockTime: { ...TYPOGRAPHY.monoLarge, color: COLORS.gold },
  statusContainer: { alignItems: 'center', paddingVertical: SPACING.sm },
  statusText: { ...TYPOGRAPHY.headlineSmall, textAlign: 'center' },
  aiThinking: { ...TYPOGRAPHY.bodySmall, color: COLORS.gold, marginTop: 2 },
  boardContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.md },
  historyContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.bgSurface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  historyScroll: { maxHeight: 60 },
  historyContent: { flexDirection: 'row', gap: SPACING.sm, paddingVertical: SPACING.xs },
  moveItem: { flexDirection: 'row', alignItems: 'center', gap: 2, minWidth: 50 },
  moveNumber: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted, width: 20 },
  moveText: { paddingHorizontal: SPACING.xs },
  moveSan: { ...TYPOGRAPHY.bodyMedium },
  controls: { paddingBottom: SPACING.md },
  controlRow: { flexDirection: 'row', gap: SPACING.sm },
  modalOverlay: { flex: 1, backgroundColor: COLORS.bgOverlay, justifyContent: 'center', alignItems: 'center', padding: SPACING.md },
  modalContent: {
    backgroundColor: COLORS.bgElevated,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.lg,
    minWidth: 280,
    ...SHADOWS.lg,
  },
  modalHeader: { borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: SPACING.md, width: '100%' },
  modalTitle: { ...TYPOGRAPHY.displaySmall, color: COLORS.textPrimary, textAlign: 'center' },
  modalResult: { marginVertical: SPACING.md },
  modalDetails: { gap: SPACING.xs, width: '100%' },
  modalDetail: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textSecondary, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', gap: SPACING.md, width: '100%', marginTop: SPACING.md },
});