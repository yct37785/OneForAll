import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { s } from '../Defines/Styles';

/******************************************************************************************************************
 * IconPillProps props
 ******************************************************************************************************************/
type IconPillProps = {
  icon: string;
  style?: ViewStyle;

  /**
   * Optional overrides (defaults come from theme).
   */
  pillSize?: number;
  iconSize?: number;
  backgroundColor?: string;
  iconColor?: string;
};

/******************************************************************************************************************
 * Small reusable "pill" that shows an icon inside a rounded square.
 ******************************************************************************************************************/
const IconPill: React.FC<IconPillProps> = ({
  icon,
  style,
  pillSize = s(4),
  iconSize = s(2),
  backgroundColor,
  iconColor,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.pill,
        {
          width: pillSize,
          height: pillSize,
          borderRadius: pillSize / 2,
          backgroundColor: backgroundColor ?? theme.colors.secondaryContainer,
        },
        style,
      ]}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={iconSize}
        color={iconColor ?? theme.colors.onSecondaryContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(IconPill);
