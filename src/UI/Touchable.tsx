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
import { TOUCHABLE_DEFAULTS } from '../defines/styles';

/******************************************************************************************************************
 * Touchable props
 ******************************************************************************************************************/
export interface TouchableProps {
  feedback?: 'opacity' | 'none' | null;
  disabled?: boolean | null;

  onPress?: TouchableNativeFeedbackProps['onPress'] | null;
  onPressIn?: TouchableNativeFeedbackProps['onPressIn'] | null;
  onPressOut?: TouchableNativeFeedbackProps['onPressOut'] | null;
  onLongPress?: TouchableNativeFeedbackProps['onLongPress'] | null;

  // RN Navigation may pass null
  delayLongPress?: number | null;

  style?: StyleProp<ViewStyle> | null;

  // overridable, but defaulted from Styles
  pressOpacity?: number | null;
  rippleColor?: string | null;
  rippleBorderless?: boolean | null;

  // Android-only
  useForeground?: boolean | null;
  
  children?: React.ReactNode | null;
}

/******************************************************************************************************************
 * Touchable comp
 ******************************************************************************************************************/
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

    pressOpacity,
    rippleColor,
    rippleBorderless = TOUCHABLE_DEFAULTS.rippleBorderless,
    useForeground = true,

    children,
  }) => {
    const theme = useTheme();
    const isOpacity = feedback === 'opacity';
    const safeDelayLongPress = typeof delayLongPress === 'number' ? delayLongPress : undefined;

    const resolvedPressOpacity =
      pressOpacity ??
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
        ? TouchableNativeFeedback.Ripple(resolvedRippleColor, rippleBorderless ?? false)
        : undefined;

    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback
          disabled={disabled ?? undefined}
          onPress={onPress ?? undefined}
          onPressIn={onPressIn ?? undefined}
          onPressOut={onPressOut ?? undefined}
          onLongPress={onLongPress ?? undefined}
          delayLongPress={safeDelayLongPress}
          background={ripple}
          useForeground={useForeground ?? false}
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