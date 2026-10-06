import React, { memo } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Icon, useTheme, MD3Theme } from 'react-native-paper';
import IconButton, { IconButtonProps } from './IconButton';

/******************************************************************************************************************
 * ToggleButton props
 ******************************************************************************************************************/
export type ToggleButtonProps = Omit<IconButtonProps, 'bgColor' | 'iconColor'> & {
  selected?: boolean;
};

export function getToggleBtnColor(theme: MD3Theme, isSelected: boolean, type: 'bg' | 'fg'): string {
  if (type === 'bg') {
    return isSelected ? theme.colors.primary : 'transparent';
  }
  return isSelected ? theme.colors.onPrimary : theme.colors.onSurfaceVariant;
}

/******************************************************************************************************************
 * Uses IconButton:
 *  - Renders an icon
 *  - Highlights when selected
 ******************************************************************************************************************/
const ToggleButton: React.FC<ToggleButtonProps> = memo(
  ({
    selected = false,
    style,
    ...rest
  }) => {
    const theme = useTheme();
    return (
      <IconButton
        {...rest}
        bgColor={getToggleBtnColor(theme, selected, 'bg')}
        iconColor={getToggleBtnColor(theme, selected, 'fg')}
      />
    );
  }
);

export default ToggleButton;