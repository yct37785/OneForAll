import React, { memo } from 'react';
import type { ScreenType } from '@Shared/Screens/Screen';
import { StackNavigator } from '@Shared/Nav/StackNavigator';

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
