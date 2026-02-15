import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { s, APP_BAR_H } from '../Defines/Styles';
import AdBanner from '../UI/AdBanner';

const PROD_BANNER_ID = process.env.EXPO_PUBLIC_ADMOB_SCREEN_LAYOUT_BANNER_ID;

export type ScreenLayoutProps = {
  showAppBar?: boolean;
  showTitle?: boolean;
  title?: string;
  showBack?: boolean; // show back btn if can go back
  LeftContent?: React.ReactNode;
  RightContent?: React.ReactNode;
  showBannerAd?: boolean; // show banner ad at bottom of layout
  children?: React.ReactNode;
};

/******************************************************************************************************************
 * Screen layout — Base view for screens:
 * - SafeAreaView (react-native-safe-area-context)
 * - React Native Paper Appbar
 * - Back button only shows when allowed (navigation.canGoBack())
 ******************************************************************************************************************/
export const ScreenLayout: React.FC<ScreenLayoutProps> = memo(
  ({
    showAppBar = false,
    showTitle = true,
    title,
    showBack = false,
    LeftContent,
    RightContent,
    showBannerAd = true,
    children
  }) => {
    const navigation = useNavigation<any>();

    // only show back if the screen wants it AND nav stack allows it.
    const shouldShowBack = useMemo(() => {
      if (!showBack) return false;
      if (!navigation?.canGoBack) return false;
      return navigation.canGoBack();
    }, [showBack, navigation]);

    const handleBackPress = () => {
      if (navigation?.canGoBack?.()) {
        navigation.goBack();
      }
    };

    const safeAreaEdges: Edge[] = showAppBar ? [] : ["top"];

    return (
      <View style={styles.container}>
        {showAppBar ? <Appbar.Header elevated style={{ height: APP_BAR_H }}>
          {/* Left */}
          {shouldShowBack ? (
            <Appbar.BackAction onPress={handleBackPress} />
          ) : (
            LeftContent
          )}

          {/* Title */}
          {showTitle && title ? <Appbar.Content title={title} /> : null}

          {/* Right */}
          {RightContent}
        </Appbar.Header> : null}

        {/* Screen content */}
        <SafeAreaView style={styles.content} edges={safeAreaEdges}>
          <View style={styles.body}>{children}</View>

          {/* Banner ad */}
          {showBannerAd ? <AdBanner admobUnitID={PROD_BANNER_ID} /> : null}
        </SafeAreaView>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  body: {
    flex: 1
  },
});
