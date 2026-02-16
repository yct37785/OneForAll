import React, { memo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';
import type { ScreenNavigate, ScreenGoBack, ScreenType } from '../Screens/Screen';

/******************************************************************************************************************
 * StackNavigator props:
 * - We allow "screen components" OR "navigator components"
 * - Navigators can ignore ScreenProps safely
 ******************************************************************************************************************/
export type RootStackNavigatorProps = {
  initialRouteName: string;
  screenMap: Record<string, ScreenType>;
};

const Stack = createNativeStackNavigator();

/******************************************************************************************************************
 * StackNavigator props
 ******************************************************************************************************************/
export const StackNavigator: React.FC<RootStackNavigatorProps> = memo(
  ({ initialRouteName, screenMap }) => {
    return (
      <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
        {Object.entries(screenMap).map(([name, ScreenOrNavigator]) => (
          <Stack.Screen key={name} name={name}>
            {(props: NativeStackScreenProps<ParamListBase>) => {
              const { navigation, route } = props;

              // abstraction layer
              const navigate: ScreenNavigate = (routeName, params) => {
                navigation.navigate(routeName, params);
              };

              const goBack: ScreenGoBack = () => {
                if (navigation.canGoBack()) navigation.goBack();
              };

              // treat navigator the same as a screen, it can ignore these props
              return (
                <ScreenOrNavigator
                  routeName={route.name}
                  navigate={navigate}
                  goBack={goBack}
                  param={route.params}
                />
              );
            }}
          </Stack.Screen>
        ))}
      </Stack.Navigator>
    );
  }
);
