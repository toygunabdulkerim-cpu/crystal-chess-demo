// Puzzle Screen
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Chess, Square } from 'chess.js';
import { usePuzzleStore } from '@/store/puzzleStore';
import { useUserStore } from '@/store/userStore';
import { Screen } from '@/components/Screen';
import { Button, Card, Badge, SectionHeader, Divider } from '@/components';
import { ChessBoard } from '@/components/ChessBoard';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY, FILES, RANKS } from '@/constants/design';
import { formatElo } from '@/utils/helpers';

export default function PuzzleScreen() {
  const router = useRouter();
  const {
    currentPuzzle,
    progress,
    isSolving,
    showSolution,
    attempts,
    loadPuzzle,
    nextPuzzle,
    previousPuzzle,
    makeMove,
    useHint,
    toggleSolution,
    resetPuzzle,
    giveUp,
  } = usePuzzleStore();
  const { profile, addGameResult } = useUserStore();

  const [selectedSquare, setSelectedSquare] = React.useState<Square | null>(null);
  const [moveFrom, setMoveFrom] = React.useState<Square | null>(null);
  const [moveHistory, setMoveHistory] = React.useState<string[]>([]);

  useEffect(() => {
    if (currentPuzzle) {
      loadPuzzle(currentPuzzle.id);
    }
  }, []);

  useEffect(() => {
    if (currentPuzzle && isSolving) {
      // Reset selection on new puzzle
      setSelectedSquare(null);
      setMoveFrom(null);
      setMoveHistory([]);
    }
  }, [currentPuzzle, isSolving]);

  const handleSquarePress = (square: Square) => {
    if (!currentPuzzle || !isSolving) return;

    if (moveFrom === null) {
      // First click - select piece
      setMoveFrom(square);
      setSelectedSquare(square);
    } else {
      // Second click - attempt move
      const success = makeMove(moveFrom, square);
      if (success) {
        setMoveHistory(prev => [...prev, `${moveFrom}${square}`]);
      }
      setMoveFrom(null);
      setSelectedSquare(null);
    }
  };

  if (!currentPuzzle) {
    return (
      <Screen style={styles.screen}>
        <View style={styles.loading}><Text style={styles.loadingText}>Puzzle yükleniyor...</Text></View>
      </Screen>
    );
  }

  const isComplete = !isSolving;
  const currentStep = Math.floor(attempts / 2);
  const solutionMoves = currentPuzzle.solution;
  const nextMove = solutionMoves[currentStep * 2] && solutionMoves[currentStep * 2 + 1];

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Badge variant="crystal" size="md">Puzzle #{progress.currentPuzzleIndex + 1}</Badge>
            <Badge variant={currentPuzzle.rating >= 1800 ? 'error' : currentPuzzle.rating >= 1400 ? 'warning' : 'success'} size="sm">
              {currentPuzzle.rating}
            </Badge>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.streakText}>🔥 {progress.streak}</Text>
            <Text style={styles.ratingText}>⭐ {progress.rating}</Text>
          </View>
        </View>

        {/* Description */}
        <Card variant="elevated" padding="md" style={styles.descCard}>
          <Text style={styles.descTitle}>{currentPuzzle.description}</Text>
          <Text style={styles.descThemes}>{currentPuzzle.themes.join(', ')}</Text>
        </Card>

        {/* Chess Board */}
        <View style={styles.boardContainer}>
          <ChessBoard
            size={Math.min(340, 320)}
            interactive={isSolving}
            fen={currentPuzzle.fen}
            showCoordinates={true}
            selectedSquare={selectedSquare}
            legalMoves={moveFrom ? [solutionMoves[currentStep * 2 + 1] as Square] : []}
            onSquarePress={handleSquarePress}
            orientation="w"
          />
        </View>

        {/* Move History */}
        <Card variant="default" padding="md" style={styles.historyCard}>
          <Text style={styles.historyTitle}>Hamleler</Text>
          <View style={styles.historyMoves}>
            {moveHistory.map((move, index) => (
              <Text key={index} style={styles.historyMove}>
                {Math.floor(index / 2) + 1}. {move} {' '}
              </Text>
            ))}
            {showSolution && solutionMoves.length > moveHistory.length && (
              <Text style={[styles.historyMove, { color: COLORS.gold }]}>
                {solutionMoves.slice(moveHistory.length).join(' ')}
              </Text>
            )}
          </View>
        </Card>

        {/* Controls */}
        <View style={styles.controls}>
          {isSolving ? (
            <>
              <Button title="İpucu" onPress={() => {
                const hint = useHint();
                if (hint) alert(hint);
              }} variant="outline" size="md" leftIcon="💡" />
              <Button title="Çözümü Göster" onPress={toggleSolution} variant="secondary" size="md" leftIcon="👁️" />
              <Button title="Pes Et" onPress={giveUp} variant="outline" size="md" style={{ borderColor: COLORS.loss }} leftIcon="🏳️" />
            </>
          ) : (
            <>
              <Button title="Yeniden Dene" onPress={resetPuzzle} variant="secondary" size="md" leftIcon="🔄" />
              <Button title="Sonraki Puzzle" onPress={nextPuzzle} variant="gold" size="md" leftIcon="➡️" />
            </>
          )}
        </View>

        {/* Progress */}
        <Divider />
        <SectionHeader title="İlerleme" />
        <Card variant="elevated" padding="md">
          <View style={styles.progressRow}>
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{progress.totalSolved}</Text>
              <Text style={styles.progressLabel}>Çözülen</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{progress.failed.length}</Text>
              <Text style={styles.progressLabel}>Başarısız</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{progress.streak}</Text>
              <Text style={styles.progressLabel}>Seri</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{progress.rating}</Text>
              <Text style={styles.progressLabel}>Puzzle ELO</Text>
            </View>
          </View>
        </Card>

        {/* Navigation */}
        <View style={styles.navButtons}>
          <Button
            title="Önceki"
            onPress={previousPuzzle}
            variant="outline"
            size="md"
            disabled={progress.currentPuzzleIndex === 0}
          />
          <Button
            title="Sonraki"
            onPress={nextPuzzle}
            variant="outline"
            size="md"
            disabled={progress.currentPuzzleIndex >= 11}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { padding: SPACING.md, paddingBottom: 100, gap: SPACING.lg },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { ...TYPOGRAPHY.bodyLarge, color: COLORS.textMuted },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', gap: SPACING.sm },
  headerRight: { flexDirection: 'row', gap: SPACING.md, alignItems: 'center' },
  streakText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gold },
  ratingText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textSecondary },
  descCard: { borderLeftWidth: 3, borderLeftColor: COLORS.gold },
  descTitle: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textPrimary },
  descThemes: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted, marginTop: SPACING.xs },
  boardContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.md },
  historyCard: { marginTop: SPACING.md },
  historyTitle: { ...TYPOGRAPHY.labelMedium, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  historyMoves: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  historyMove: { ...TYPOGRAPHY.bodySmall, color: COLORS.textSecondary },
  controls: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-around' },
  progressItem: { alignItems: 'center', gap: 2 },
  progressValue: { ...TYPOGRAPHY.headlineLarge, color: COLORS.gold },
  progressLabel: { ...TYPOGRAPHY.labelSmall, color: COLORS.textMuted },
  navButtons: { flexDirection: 'row', gap: SPACING.md },
});