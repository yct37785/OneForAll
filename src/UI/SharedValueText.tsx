import { memo } from 'react';
import { StyleProp, TextInput, TextStyle } from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

/********************************************************************************************************************
 * Text component to update value natively.
 * 
 * @param value - Animated SharedValue (not DerviedValue)
 * @param style - apply style to text
 ********************************************************************************************************************/
function SharedValueText({ value, style }: {
  value: SharedValue<string>;
  style?: StyleProp<TextStyle>;
}) {

  const animatedProps = useAnimatedProps(() => ({
    text: value.value,
    defaultValue: value.value
  }));

  return (
    <AnimatedTextInput
      editable={false}
      pointerEvents="none"
      underlineColorAndroid="transparent"
      animatedProps={
        animatedProps
      }
      style={style}
    />
  );
}

export default memo(SharedValueText);