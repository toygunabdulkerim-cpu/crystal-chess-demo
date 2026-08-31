// Custom hooks
import { useEffect, useRef, useCallback, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useSettingsStore } from '@/store/settingsStore';

export const useGameClock = () => {
  const { game, updateClocks } = useGameStore();

  useEffect(() => {
    if (!game || game.status !== 'ongoing') return;

    const interval = setInterval(() => {
      updateClocks();
    }, 1000);

    return () => clearInterval(interval);
  }, [game, updateClocks]);

  return game?.clocks || { w: 0, b: 0 };
};

export const useAITurn = () => {
  const { isAITurn, aiThinking, triggerAIMove, game } = useGameStore();

  useEffect(() => {
    if (isAITurn && !aiThinking && game?.status === 'ongoing') {
      triggerAIMove();
    }
  }, [isAITurn, aiThinking, game?.status, triggerAIMove]);
};

export const useBoardOrientation = () => {
  const { orientation, setOrientation, game } = useGameStore();

  const toggleOrientation = useCallback(() => {
    setOrientation(orientation === 'w' ? 'b' : 'w');
  }, [orientation, setOrientation]);

  const setOrientationFromPerspective = useCallback((perspective: 'w' | 'b') => {
    setOrientation(perspective);
  }, [setOrientation]);

  return { orientation, toggleOrientation, setOrientation: setOrientationFromPerspective };
};

export const useGameActions = () => {
  const {
    makeMove,
    undoMove,
    setSelectedSquare,
    setPromotionPending,
    completePromotion,
    resign,
    offerDraw,
    game,
    promotionPending,
  } = useGameStore();

  const handleSquarePress = useCallback((square: string) => {
    if (!game || game.status !== 'ongoing') return;
    if (game.turn === 'b' && !game.black.isHuman) return; // AI's turn

    const piece = game.fen.split(' ')[0]; // Simplified - would need proper board lookup
    setSelectedSquare(square as any);
  }, [game, setSelectedSquare]);

  const handlePromotion = useCallback((promotion: 'q' | 'r' | 'b' | 'n') => {
    completePromotion(promotion);
  }, [completePromotion]);

  return {
    makeMove,
    undoMove,
    handleSquarePress,
    handlePromotion,
    resign,
    offerDraw,
    promotionPending,
    canUndo: game && game.moves.length > 0 && game.status === 'ongoing',
    isPlayerTurn: game && game.turn === 'w' && game.status === 'ongoing',
  };
};

export const useSettings = () => {
  const { settings, updateSettings, toggleSetting } = useSettingsStore();
  return { settings, updateSettings, toggleSetting };
};

export const useUserProfile = () => {
  const { profile, updateProfile, updateUsername, updateElo, updateSettings, addGameResult } =
    useUserStore();
  return { profile, updateProfile, updateUsername, updateElo, updateSettings, addGameResult };
};

// Need to import useUserStore
import { useUserStore } from '@/store/userStore';