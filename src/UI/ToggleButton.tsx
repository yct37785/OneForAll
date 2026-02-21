import React, { memo } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import IconButton, { IconButtonProps } from './IconButton';

/******************************************************************************************************************
 * ToggleButton props
 ******************************************************************************************************************/
export type ToggleButtonProps = Omit<IconButtonProps, 'bgColor' | 'iconColor'> & {
  selected?: boolean;
};

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

    const bg = selected ? theme.colors.primary : undefined;
    const fg = selected ? theme.colors.onPrimary : theme.colors.onSurfaceVariant;

    return (
      <IconButton
        {...rest}
        bgColor={bg}
        iconColor={fg}
      />
    );
  }
);

export default ToggleButton;