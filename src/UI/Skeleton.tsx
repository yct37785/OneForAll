import React, { memo, useEffect, useRef } from 'react';
import { Animated, DimensionValue, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { s } from '../defines/styles';

/********************************************************************************************************************
 * Skeleton props
 ********************************************************************************************************************/
export type SkeletonProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  backgroundColor?: string;
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
};

/********************************************************************************************************************
 * Skeleton
 *
 * Simple reusable placeholder UI with a pulsing opacity animation.
 ********************************************************************************************************************/
const Skeleton: React.FC<SkeletonProps> = memo(
  ({
    width = '100%',
    height = s(2),
    borderRadius = s(0.5),
    backgroundColor,
    animated = true,
    style
  }) => {
    const theme = useTheme();
    const opacity = useRef(new Animated.Value(0)).current;

    /**
     * Pulse animation.
     */
    useEffect(() => {
      if (!animated) {
        opacity.setValue(1);
        return;
      }

      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 700, useNativeDriver: true })
        ])
      );

      animation.start();

      return () => {
        animation.stop();
      };
    }, [animated, opacity]);

    /**
     * Render.
     */
    const animatedOpacity = animated
      ? opacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0.35, 0.75]
      }) : 1;

    return (
      <Animated.View
        style={[
          styles.skeleton,
          {
            width,
            height,
            borderRadius,

            backgroundColor:
              backgroundColor ??
              theme.colors.surfaceVariant,

            opacity: animatedOpacity
          },
          style
        ]}
      />
    );
  }
);

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden'
  }
});

export default Skeleton;