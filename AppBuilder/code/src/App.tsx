// deps
import 'react-native-get-random-values';
import 'react-native-gesture-handler';
// core
import React, { memo, useEffect } from 'react';
import { StatusBar, Platform, LogBox } from 'react-native';
// theme
import { Provider as PaperProvider, adaptNavigationTheme, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
// UI & layout
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// nav
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { StackNavigator } from '@shared/Nav/StackNavigator';
// pages
import MainTabsNavigator from './Pages/MainTabsNavigator';
// ads
// import { AdsProvider } from '@shared/Hooks/UseAds';

// define
LogBox.ignoreAllLogs();

// mode
console.log('DEV MODE:', __DEV__);

// Navigation theme adaptation (Paper ↔ React Navigation)
const { LightTheme: NavLight, DarkTheme: NavDark } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

// screen map
const screenMap = {
  MainTabs: MainTabsNavigator
};

/******************************************************************************************************************
 * Root App
 ******************************************************************************************************************/
const isDarkMode = true;
const Root: React.FC<{}> = (props) => {
  const paperTheme = isDarkMode ? MD3DarkTheme : MD3LightTheme;
  const navTheme = isDarkMode ? NavDark : NavLight;
  
  /**
   * Load theme based on type
   */
  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync(isDarkMode ? 'light' : 'dark');
    }
  }, [isDarkMode]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={paperTheme}>
        {/* <AdsProvider umpId={process.env.EXPO_PUBLIC_ADMOB_DEVICE_UMP_ID}> */}
          <NavigationContainer theme={navTheme}>
            <MenuProvider>
              <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
                <StackNavigator initialRouteName='MainTabs' screenMap={screenMap} />
              </SafeAreaView>
            </MenuProvider>
          </NavigationContainer>
        {/* </AdsProvider> */}
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

const AppEntry: React.FC<{}> = (props) => {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <Root {...props} />
      </KeyboardProvider>
    </SafeAreaProvider>
  );
};

export default memo(AppEntry);