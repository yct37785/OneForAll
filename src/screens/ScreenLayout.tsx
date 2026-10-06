import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { s, APP_BAR_H } from '../defines/styles';

/******************************************************************************************************************
 * ScreenLayout props
 ******************************************************************************************************************/
export type ScreenLayoutProps = {
  showAppBar?: boolean;
  showTitle?: boolean;
  title?: string;
  showBack?: boolean; // show back btn if can go back
  LeftContent?: React.ReactNode;
  RightContent?: React.ReactNode;
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
    children
  }) => {
    const theme = useTheme();
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
        <SafeAreaView style={[styles.content, { backgroundColor: theme.colors.background }]} edges={safeAreaEdges}>
          <View style={styles.body}>{children}</View>
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
  },
  body: {
    flex: 1
  },
});
