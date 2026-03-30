import React, { memo, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { s } from '../Defines/Styles';

export type PopupToggleOption<T extends string> = {
  value: T;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

type PopupToggleButtonProps<T extends string> = {
  selected?: boolean;
  onPress?: () => void;

  options: PopupToggleOption<T>[];
  selectedValue: T;
  onPick: (value: T) => void;
};

const PopupToggleButtonInner = <T extends string>({
  selected = false,
  onPress,
  options,
  selectedValue,
  onPick,
}: PopupToggleButtonProps<T>) => {
  const theme = useTheme();

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue) ?? options[0],
    [options, selectedValue]
  );

  if (!selectedOption) return null;

  const triggerBg = selected ? theme.colors.primary : 'transparent';
  const triggerFg = selected ? theme.colors.onPrimary : theme.colors.onSurfaceVariant;

  return (
    <Menu>
      <MenuTrigger onPress={onPress}>
        <View
          style={[
            styles.trigger,
            { backgroundColor: triggerBg },
          ]}
        >
          <Icon
            source={selectedOption.icon}
            size={20}
            color={triggerFg}
          />
        </View>
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: {
            padding: s(0.75),
            borderRadius: s(1),
            backgroundColor: theme.colors.elevation?.level2 ?? theme.colors.surface,
          },
        }}
      >
        <View style={styles.optionsRow}>
          {options.map((option) => {
            const isSelected = option.value === selectedValue;

            return (
              <MenuOption
                key={option.value}
                onSelect={() => onPick(option.value)}
              >
                <Pressable
                  pointerEvents='none'
                  style={[
                    styles.optionOuter,
                    {
                      borderWidth: isSelected ? 2 : 0,
                      borderColor: theme.colors.primary,
                      backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                    },
                  ]}
                >
                  <Icon
                    source={option.icon}
                    size={20}
                    color={isSelected ? theme.colors.onPrimary : theme.colors.onSurfaceVariant}
                  />
                </Pressable>
              </MenuOption>
            );
          })}
        </View>
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  trigger: {
    minWidth: s(6),
    minHeight: s(6),
    borderRadius: s(1.25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: s(1),
  },
  optionOuter: {
    minWidth: s(6),
    minHeight: s(6),
    borderRadius: s(1.25),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const PopupToggleButton = memo(PopupToggleButtonInner) as typeof PopupToggleButtonInner;

export default PopupToggleButton;