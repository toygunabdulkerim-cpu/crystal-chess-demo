// Core UI Components
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Animated, Easing, Switch, TextInput, StatusBar, ScrollView, Modal as RNModal } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY, ANIMATION } from '@/constants/design';

// Button variants
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: any;
}

export const Button = React.forwardRef<any, ButtonProps>(
  (
    {
      title,
      onPress,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      style,
    },
    ref
  ) => {
    const baseStyles = [
      styles.buttonBase,
      styles[variant],
      styles[size],
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
      style,
    ];

    return (
      <TouchableOpacity
        ref={ref}
        style={baseStyles}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <AnimatedSpinner size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} color={variant === 'primary' ? '#0a0a0f' : COLORS.gold} />
        ) : (
          <>
            {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
            <Text style={[styles.buttonText, styles[variant + 'Text'], styles[size + 'Text']]}>{title}</Text>
            {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
          </>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

// Animated Spinner
const AnimatedSpinner = ({ size = 16, color = COLORS.gold }) => {
  const spin = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderWidth: 2,
        borderColor: 'transparent',
        borderTopColor: color,
        borderRightColor: color,
        borderRadius: size / 2,
        transform: [{ rotate }],
      }}
    />
  );
};

// Card component
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'gold';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: any;
  onPress?: () => void;
}

export const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  style,
  onPress,
}: CardProps) => {
  const baseStyles = [
    styles.cardBase,
    styles['card_' + variant],
    styles['pad_' + padding],
    onPress && styles.clickable,
    style,
  ];

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component style={baseStyles} onPress={onPress} activeOpacity={0.9}>
      {children}
    </Component>
  );
};

// Input component
interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: any;
}

export const Input = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  leftIcon,
  rightIcon,
  style,
}: InputProps) => {
  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {leftIcon && <View style={styles.inputIcon}>{leftIcon}</View>}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          placeholderTextColor={COLORS.textMuted}
        />
        {rightIcon && <View style={styles.inputIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.inputError}>{error}</Text>}
    </View>
  );
};

// Badge component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'crystal' | 'success' | 'warning' | 'error' | 'default';
  size?: 'sm' | 'md';
  style?: any;
}

export const Badge = ({ children, variant = 'default', size = 'md', style }: BadgeProps) => {
  return (
    <View style={[styles.badgeBase, styles['badge_' + variant], styles['badgeSize_' + size], style]}>
      <Text style={[styles.badgeText, styles['badge_' + variant + 'Text'], styles['badgeSize_' + size + 'Text']]}>{children}</Text>
    </View>
  );
};

// Avatar component
interface AvatarProps {
  source?: { uri: string } | number;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: any;
  border?: boolean;
}

export const Avatar = ({ source, name, size = 'md', style, border = false }: AvatarProps) => {
  const sizeMap = { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 };
  const fontSizeMap = { xs: 10, sm: 12, md: 14, lg: 20, xl: 28 };
  const dimension = sizeMap[size];

  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getColorFromName = (n: string) => {
    let hash = 0;
    for (let i = 0; i < n.length; i++) hash = n.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 60%, 50%)`;
  };

  if (source) {
    return (
      <View style={[styles.avatar, { width: dimension, height: dimension }, border && styles.avatarBorder, style]}>
        <Image
          source={source}
          style={[{ width: dimension, height: dimension, borderRadius: dimension / 2 }, styles.avatarImage]}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.avatar,
        { width: dimension, height: dimension, backgroundColor: getColorFromName(name || 'Player') },
        border && styles.avatarBorder,
        style,
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: fontSizeMap[size] }]}>{name ? getInitials(name) : '?'}</Text>
    </View>
  );
};

// Divider
export const Divider = ({ style, orientation = 'horizontal' }: { style?: any; orientation?: 'horizontal' | 'vertical' }) => {
  return <View style={[orientation === 'horizontal' ? styles.dividerH : styles.dividerV, style]} />;
};

// Section Header
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
  style?: any;
}

export const SectionHeader = ({ title, subtitle, action, style }: SectionHeaderProps) => {
  return (
    <View style={[styles.sectionHeader, style]}>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
      {action && <TouchableOpacity onPress={action.onPress}><Text style={styles.sectionAction}>{action.label}</Text></TouchableOpacity>}
    </View>
  );
};

// Empty State
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message?: string;
  action?: { label: string; onPress: () => void };
  style?: any;
}

export const EmptyState = ({ icon, title, message, action, style }: EmptyStateProps) => {
  return (
    <View style={[styles.emptyState, style]}>
      <View style={styles.emptyIcon}>{icon}</View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {message && <Text style={styles.emptyMessage}>{message}</Text>}
      {action && <Button title={action.label} onPress={action.onPress} variant="outline" size="sm" style={{ marginTop: SPACING.md }} />}
    </View>
  );
};

// Modal Overlay
interface ModalProps {
  visible: boolean;
  children: React.ReactNode;
  onClose: () => void;
  style?: any;
}

export const Modal = ({ visible, children, onClose, style }: ModalProps) => {
  if (!visible) return null;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: ANIMATION.normal, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: ANIMATION.normal, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [visible, fadeAnim, slideAnim]);

  const close = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: ANIMATION.fast, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 50, duration: ANIMATION.fast, useNativeDriver: true }),
    ]).start(({ finished }) => finished && onClose());
  };

  return (
    <Animated.View
      style={[styles.modalOverlay, { opacity: fadeAnim }]}
      onStartShouldSetResponder={() => true}
      onResponderGrant={close}
    >
      <Animated.View
        style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }, style]}
        onStartShouldSetResponder={() => true}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
};

// Styles
const styles = StyleSheet.create({
  buttonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  primary: {
    backgroundColor: COLORS.gold,
    ...SHADOWS.gold,
  },
  secondary: {
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  gold: {
    backgroundColor: COLORS.gold,
    ...SHADOWS.gold,
  },
  primaryText: { color: COLORS.bgDeep },
  secondaryText: { color: COLORS.textPrimary },
  outlineText: { color: COLORS.gold },
  ghostText: { color: COLORS.textSecondary },
  goldText: { color: COLORS.bgDeep },
  sm: { paddingVertical: SPACING.xs, minHeight: 36 },
  md: { paddingVertical: SPACING.sm, minHeight: 44 },
  lg: { paddingVertical: SPACING.md, minHeight: 52 },
  smText: { fontSize: 12, fontWeight: '600' },
  mdText: { fontSize: 14, fontWeight: '600' },
  lgText: { fontSize: 16, fontWeight: '700' },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
  iconLeft: { marginRight: SPACING.xs },
  iconRight: { marginLeft: SPACING.xs },
  buttonText: { textAlign: 'center', fontFamily: TYPOGRAPHY.fontFamily },

  cardBase: {
    borderRadius: BORDER_RADIUS.lg,
  },
  card_default: {
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  card_elevated: {
    backgroundColor: COLORS.bgElevated,
    ...SHADOWS.md,
  },
  card_outlined: {
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  card_gold: {
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
  },
  pad_none: {},
  pad_sm: { padding: SPACING.sm },
  pad_md: { padding: SPACING.md },
  pad_lg: { padding: SPACING.lg },
  clickable: { ...SHADOWS.sm },

  inputContainer: { gap: SPACING.xs },
  inputLabel: { ...TYPOGRAPHY.labelMedium, color: COLORS.textSecondary },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgDeep,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.sm,
  },
  inputIcon: { paddingHorizontal: SPACING.xs },
  inputError: { ...TYPOGRAPHY.labelSmall, color: COLORS.loss },

  badgeBase: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
  },
  badge_gold: { backgroundColor: COLORS.goldDim, borderWidth: 1, borderColor: COLORS.gold },
  badge_crystal: { backgroundColor: COLORS.crystalDim, borderWidth: 1, borderColor: COLORS.crystal },
  badge_success: { backgroundColor: 'rgba(74, 222, 128, 0.2)', borderWidth: 1, borderColor: COLORS.win },
  badge_warning: { backgroundColor: 'rgba(251, 191, 36, 0.2)', borderWidth: 1, borderColor: COLORS.draw },
  badge_error: { backgroundColor: 'rgba(248, 113, 113, 0.2)', borderWidth: 1, borderColor: COLORS.loss },
  badge_default: { backgroundColor: COLORS.bgElevated, borderWidth: 1, borderColor: COLORS.border },
  badge_goldText: { color: COLORS.gold },
  badge_crystalText: { color: COLORS.crystal },
  badge_successText: { color: COLORS.win },
  badge_warningText: { color: COLORS.draw },
  badge_errorText: { color: COLORS.loss },
  badge_defaultText: { color: COLORS.textSecondary },
  badgeSize_sm: { paddingVertical: 2, minHeight: 18 },
  badgeSize_md: { paddingVertical: 4, minHeight: 24 },
  badgeSize_smText: { fontSize: 10, fontWeight: '600' },
  badgeSize_mdText: { fontSize: 12, fontWeight: '600' },
  badgeText: { fontFamily: TYPOGRAPHY.fontFamily },

  avatar: {
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarBorder: { borderWidth: 2, borderColor: COLORS.gold },
  avatarImage: { borderRadius: 9999 },
  avatarText: { color: '#fff', fontWeight: '700', fontFamily: TYPOGRAPHY.fontFamily },

  dividerH: { height: 1, backgroundColor: COLORS.borderSubtle, marginVertical: SPACING.md },
  dividerV: { width: 1, backgroundColor: COLORS.borderSubtle, marginHorizontal: SPACING.md },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.headlineMedium, color: COLORS.textPrimary },
  sectionSubtitle: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted, marginTop: 2 },
  sectionAction: { ...TYPOGRAPHY.labelMedium, color: COLORS.gold },

  emptyState: { alignItems: 'center', padding: SPACING.xxl, gap: SPACING.md },
  emptyIcon: { marginBottom: SPACING.sm },
  emptyTitle: { ...TYPOGRAPHY.headlineSmall, color: COLORS.textPrimary, textAlign: 'center' },
  emptyMessage: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textMuted, textAlign: 'center' },

  modalOverlay: { flex: 1, backgroundColor: COLORS.bgOverlay, justifyContent: 'center', padding: SPACING.md },
  modalContainer: {
    backgroundColor: COLORS.bgElevated,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
    ...SHADOWS.lg,
    maxHeight: '90%',
  },
});