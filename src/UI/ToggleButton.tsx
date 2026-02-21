import React, { memo } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Touchable from './Touchable';
import { s, ICON_SIZE_S, DISABLED_OPACITY } from '../Defines/Styles';

/******************************************************************************************************************
 * ToggleButton props
 ******************************************************************************************************************/
export type ToggleButtonProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  size?: number;
  border?: boolean;
  rippleColor?: string | null;
  style?: StyleProp<ViewStyle>;
};

/******************************************************************************************************************
 * Uses Touchable:
 *  - Renders an icon
 *  - Highlights when selected
 ******************************************************************************************************************/
const ToggleButton: React.FC<ToggleButtonProps> = memo(
  ({
    icon,
    selected = false,
    disabled = false,
    onPress,
    onLongPress,
    size = ICON_SIZE_S,
    border = false,
    rippleColor,
    style
  }) => {
    const theme = useTheme();

    const bg = selected ? theme.colors.primary : theme.colors.surface;
    const fg = selected ? theme.colors.onPrimary : theme.colors.onSurfaceVariant;
    const borderColor = selected ? theme.colors.primary : theme.colors.outlineVariant;

    return (
      <Touchable
        disabled={disabled}
        onPress={onPress}
        onLongPress={onLongPress}
        rippleColor={rippleColor}
        style={[
          {
            padding: s(1),
            borderRadius: s(1),
            backgroundColor: bg,
            borderColor: border ? borderColor : undefined,
            borderWidth: border ? 1 : undefined,
            opacity: disabled ? DISABLED_OPACITY : 1,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          },
          style,
        ]}
      >
        <MaterialCommunityIcons name={icon} size={size} color={fg} />
      </Touchable>
    );
  }
);

export default ToggleButton;