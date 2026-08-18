import React, { memo } from 'react';
import { View } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { ScreenLayout } from '@Shared/Screens/ScreenLayout';
import type { ScreenType } from '@Shared/Screens/Screen';
import { s } from '@Shared/Defines/Styles';

/******************************************************************************************************************
 * HomePage
 ******************************************************************************************************************/
const HomePage: ScreenType = () => {
  const theme = useTheme();

  return (
    <ScreenLayout title='Home' showTitle showAppBar>
      <View style={{ padding: s(1), backgroundColor: 'red', flex: 1 }}>
        <Text variant='bodyMedium'>This is the home page</Text>
      </View>
    </ScreenLayout>
  );
};

export default memo(HomePage);