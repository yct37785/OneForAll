import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
  renderers,
} from 'react-native-popup-menu';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getToggleBtnColor } from './ToggleButton';
import { s, ICON_SIZE_S } from '../defines/styles';

/******************************************************************************************************************
 * PopupToggleButton props
 ******************************************************************************************************************/
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

const { Popover } = renderers;

/******************************************************************************************************************
 * PopupToggleButton
 ******************************************************************************************************************/
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

  return (
    <Menu
      renderer={Popover}
      rendererProps={{
        placement: 'top',
      }}
    >
      <MenuTrigger onPress={onPress}>
        <View
          style={[
            styles.btn,
            { backgroundColor: getToggleBtnColor(theme, selected, 'bg') },
          ]}
        >
          <Icon
            source={selectedOption.icon}
            size={ICON_SIZE_S}
            color={getToggleBtnColor(theme, selected, 'fg')}
          />
        </View>
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsWrapper: {
            alignSelf: 'flex-start',
          },
          optionsContainer: {
            borderRadius: s(1),
            backgroundColor: theme.colors.elevation?.level2 ?? theme.colors.surface,
          },
        }}
      >
        <View style={styles.row}>
          {options.map((option) => {
            const isSelected = option.value === selectedValue;

            return (
              <MenuOption
                key={option.value}
                onSelect={() => {
                  onPick(option.value);
                }}
                customStyles={{
                  optionWrapper: {
                    padding: 0,
                  },
                }}
              >
                <View
                  style={[
                    styles.btn,
                    {
                      backgroundColor: getToggleBtnColor(theme, isSelected, 'bg'),
                    },
                  ]}
                >
                  <Icon
                    source={option.icon}
                    size={ICON_SIZE_S}
                    color={getToggleBtnColor(theme, isSelected, 'fg')}
                  />
                </View>
              </MenuOption>
            );
          })}
        </View>
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  btn: {
    padding: s(1),
    borderRadius: s(1),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    padding: s(1),
    gap: s(1),
    alignSelf: 'flex-start',
  },
});

const PopupToggleButton = memo(PopupToggleButtonInner) as typeof PopupToggleButtonInner;

export default PopupToggleButton;