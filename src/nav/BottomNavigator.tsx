import React, { memo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { ParamListBase } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Touchable from '../UI/Touchable';
import type { ScreenGoBack, ScreenNavigate, ScreenType } from '../screens/Screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { s, NAV_BAR_H, APP_BAR_H } from '../defines/styles';

/******************************************************************************************************************
 * BottomNavigator props:
 * - We allow "screen components" OR "navigator components"
 * - Navigators can ignore ScreenProps safely
 ******************************************************************************************************************/
export type TabConfig = {
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

export type BottomNavigatorProps = {
  initialRouteName: string;
  tabMap: Record<string, ScreenType>;
  tabConfig: Record<string, TabConfig>;
  showLabel?: boolean;
};

const Tab = createBottomTabNavigator();

/******************************************************************************************************************
 * BottomNavigator comp
 ******************************************************************************************************************/
export const BottomNavigator: React.FC<BottomNavigatorProps> = memo(
  ({ initialRouteName, tabMap, tabConfig, showLabel = true }) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const tabBarHeight = showLabel ? APP_BAR_H : NAV_BAR_H;

    return (
      <Tab.Navigator
        initialRouteName={initialRouteName}
        screenOptions={({ route }) => {
          const config = tabConfig[route.name];

          return {
            headerShown: false,

            tabBarShowLabel: true,
            tabBarLabel: config?.label ?? route.name,
            tabBarLabelStyle: {
              marginTop: s(0.5)
            },

            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name={config?.icon ?? 'circle-outline'}
                color={color}
                size={size}
              />
            ),

            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.onSurfaceVariant,

            tabBarStyle: {
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: insets.bottom,
              height: tabBarHeight,
              borderTopWidth: StyleSheet.hairlineWidth,
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.outlineVariant,
            },

            tabBarItemStyle: {
              height: tabBarHeight,
            },

            tabBarButton: (props) => {
              const { disabled, onPress, children, ...rest } = props;
              return (
                <Touchable disabled={disabled} onPress={onPress} {...rest}>
                  {children}
                </Touchable>
              );
            }

          };
        }}
      >
        {Object.entries(tabMap).map(([name, ScreenOrNavigator]) => (
          <Tab.Screen key={name} name={name}>
            {(props: BottomTabScreenProps<ParamListBase>) => {
              const { navigation, route } = props;

              const navigate: ScreenNavigate = (routeName, params) => {
                (navigation.navigate as any)(routeName, params);
              };

              const goBack: ScreenGoBack = () => {
                if (navigation.canGoBack()) navigation.goBack();
              };

              return (
                <ScreenOrNavigator
                  routeName={route.name}
                  navigate={navigate}
                  goBack={goBack}
                  param={route.params}
                />
              );
            }}
          </Tab.Screen>
        ))}
      </Tab.Navigator>
    );
  }
);