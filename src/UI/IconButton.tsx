import React, { memo } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Touchable from './Touchable';
import { s, ICON_SIZE_S, DISABLED_OPACITY } from '../defines/styles';

/******************************************************************************************************************
 * IconButton props
 ******************************************************************************************************************/
export type IconButtonProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  disabled?: boolean;
  iconColor?: string;
  bgColor?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

/******************************************************************************************************************
 * Uses Touchable:
 *  - Renders an icon
 ******************************************************************************************************************/
const IconButton: React.FC<IconButtonProps> = memo(
  ({
    icon,
    disabled = false,
    iconColor,
    bgColor,
    onPress,
    onLongPress,
    size = ICON_SIZE_S,
    style
  }) => {
    const theme = useTheme();
    return (
      <Touchable
        disabled={disabled}
        onPress={onPress}
        onLongPress={onLongPress}
        style={[
          {
            padding: s(1),
            borderRadius: s(1),
            backgroundColor: bgColor ?? undefined,
            opacity: disabled ? DISABLED_OPACITY : 1,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          },
          style,
        ]}
      >
        <MaterialCommunityIcons name={icon} size={size} color={iconColor ?? theme.colors.onSurfaceVariant} />
      </Touchable>
    );
  }
);

export default IconButton;