import React, { memo } from 'react';
import type { ScreenType } from '@shared/Screens/Screen';
import { StackNavigator } from '@shared/Nav/StackNavigator';

import HomePage from './HomePage';

const screenMap = {
  home: HomePage
};

const MainTabsNavigator: ScreenType = () => {
  return (
    <StackNavigator
      initialRouteName='home'
      screenMap={screenMap}
    />
  );
};

export default memo(MainTabsNavigator);
