import React, { memo } from 'react';
import {
  Pressable,
  View,
  ViewStyle,
  StyleProp,
  Platform,
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
  StyleSheet,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { TOUCHABLE_DEFAULTS } from '../Defines/Styles';

export interface TouchableProps {
  feedback?: 'opacity' | 'none';
  disabled?: boolean;

  onPress?: TouchableNativeFeedbackProps['onPress'];
  onPressIn?: TouchableNativeFeedbackProps['onPressIn'];
  onPressOut?: TouchableNativeFeedbackProps['onPressOut'];
  onLongPress?: TouchableNativeFeedbackProps['onLongPress'];

  // RN Navigation may pass null
  delayLongPress?: number | null;

  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;

  // overridable, but defaulted from Styles
  pressedOpacity?: number;
  rippleColor?: string;
  rippleBorderless?: boolean;

  // Android-only
  useForeground?: boolean;
}

const Touchable: React.FC<TouchableProps> = memo(
  ({
    feedback = 'opacity',
    disabled,

    onPress,
    onPressIn,
    onPressOut,
    onLongPress,
    delayLongPress,

    style,
    children,

    pressedOpacity,
    rippleColor,
    rippleBorderless = TOUCHABLE_DEFAULTS.rippleBorderless,
    useForeground = true,
  }) => {
    const theme = useTheme();
    const isOpacity = feedback === 'opacity';
    const safeDelayLongPress = typeof delayLongPress === 'number' ? delayLongPress : undefined;

    const resolvedPressOpacity =
      pressedOpacity ??
      (theme.dark
        ? TOUCHABLE_DEFAULTS.pressedOpacityDark
        : TOUCHABLE_DEFAULTS.pressedOpacityLight);

    const resolvedRippleColor =
      rippleColor ??
      (theme.dark
        ? TOUCHABLE_DEFAULTS.rippleColorDark
        : TOUCHABLE_DEFAULTS.rippleColorLight);

    /**************************************************************************************************************
     * Android ripple
     **************************************************************************************************************/
    const ripple =
      Platform.OS === 'android' && isOpacity && !disabled
        ? TouchableNativeFeedback.Ripple(resolvedRippleColor, rippleBorderless)
        : undefined;

    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback
          disabled={disabled}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onLongPress={onLongPress}
          delayLongPress={safeDelayLongPress}
          background={ripple}
          useForeground={useForeground}
        >
          <View style={[style, isOpacity ? styles.androidClip : null]}>
            {children}
          </View>
        </TouchableNativeFeedback>
      );
    }

    /**************************************************************************************************************
     * iOS opacity feedback
     **************************************************************************************************************/
    return (
      <Pressable
        disabled={disabled}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onLongPress={onLongPress}
        delayLongPress={safeDelayLongPress}
        style={({ pressed }) => [
          style,
          isOpacity && pressed && !disabled ? { opacity: resolvedPressOpacity } : null,
        ]}
      >
        {children}
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  androidClip: {
    overflow: 'hidden',
  },
});

export default Touchable;