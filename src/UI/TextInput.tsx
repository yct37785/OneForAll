import React, { memo, useMemo, useState } from 'react';
import {
  KeyboardTypeOptions,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { s } from '../defines/styles';

/******************************************************************************************************************
 * TextInput props & utilities
 ******************************************************************************************************************/
export type InputKind = 'text' | 'numeric' | 'password' | 'search' | 'email' | 'phone';

export type TextInputProps = Omit<RNTextInputProps, 'keyboardType' | 'secureTextEntry'> & {
  type?: InputKind;

  /**
   * Outer wrapper style (wraps border + leading/trailing + input + helper)
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Style applied to the "input row" container (border box)
   */
  contentStyle?: StyleProp<ViewStyle>;

  /**
   * Style applied to the actual RN TextInput
   */
  inputStyle?: StyleProp<TextStyle>;

  /**
   * Slot content rendered on the left/right of the input (icons, buttons, etc)
   */
  leadingContent?: React.ReactNode;
  trailingContent?: React.ReactNode;

  /**
   * Simple validation display
   */
  error?: boolean;
  errorText?: string;
  helperText?: string;

  /**
   * Basic coloring (keep this simple for now; later you can connect to a theme)
   */
  backgroundColor?: string;
  borderColor?: string;
  borderColorError?: string;
  textColor?: string;
  placeholderTextColor?: string;
};

const keyboardTypeFromKind = (kind: InputKind): KeyboardTypeOptions => {
  switch (kind) {
    case 'numeric':
      return 'number-pad';
    case 'email':
      return 'email-address';
    case 'phone':
      return 'phone-pad';
    case 'text':
    case 'password':
    case 'search':
    default:
      return 'default';
  }
};

const autoCapitalizeFromKind = (kind: InputKind): RNTextInputProps['autoCapitalize'] => {
  switch (kind) {
    case 'email':
    case 'password':
    case 'search':
      return 'none';
    default:
      return 'sentences';
  }
};

const autoCorrectFromKind = (kind: InputKind): boolean => {
  switch (kind) {
    case 'email':
    case 'password':
    case 'search':
    case 'numeric':
    case 'phone':
      return false;
    default:
      return true;
  }
};

/******************************************************************************************************************
 * TextInput comp
 ******************************************************************************************************************/
export const TextInput = memo((props: TextInputProps) => {
  const {
    type = 'text',

    containerStyle,
    contentStyle,
    inputStyle,

    leadingContent,
    trailingContent,

    error = false,
    errorText,
    helperText,

    backgroundColor = '#fff',
    borderColor = '#d0d0d0',
    borderColorError = '#d32f2f',
    textColor = '#111',
    placeholderTextColor = '#777',

    style, // RNTextInputProps style (we prefer inputStyle but support this)
    placeholder,

    ...rest
  } = props;

  const [passwordVisible, setPasswordVisible] = useState(false);

  const keyboardType = useMemo(() => keyboardTypeFromKind(type), [type]);
  const autoCapitalize = useMemo(() => autoCapitalizeFromKind(type), [type]);
  const autoCorrect = useMemo(() => autoCorrectFromKind(type), [type]);

  const secureTextEntry = type === 'password' && !passwordVisible;

  // If you want the password toggle built-in later, we can add a default trailingContent.
  // For now, caller supplies trailingContent (more flexible).

  const helperMessage = error ? (errorText ?? helperText) : helperText;

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.content,
          {
            backgroundColor,
            borderColor: error ? borderColorError : borderColor,
          },
          contentStyle,
        ]}
      >
        {leadingContent ? <View style={styles.leading}>{leadingContent}</View> : null}

        <RNTextInput
          {...rest}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          secureTextEntry={secureTextEntry}
          style={[
            styles.input,
            { color: textColor },
            style,
            inputStyle,
          ]}
          // Android vertical centering fix:
          textAlignVertical="center"
        />

        {trailingContent ? <View style={styles.trailing}>{trailingContent}</View> : null}
      </View>

      {helperMessage ? (
        <Text style={[styles.helper, error ? styles.helperError : null]}>
          {helperMessage}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: s(2),
    paddingHorizontal: s(1.5),
    // This ensures the input has a comfortable tap target & centers well
    minHeight: s(6), // with SPACE_UNIT=8 => 48px
  },

  leading: {
    marginRight: s(1),
    alignItems: 'center',
    justifyContent: 'center',
  },

  trailing: {
    marginLeft: s(1),
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    flex: 1,
    minWidth: 0,

    // Vertical centering:
    paddingVertical: Platform.OS === 'ios' ? s(1) : 0,

    // If you want perfect iOS centering, keep lineHeight close to fontSize.
    fontSize: 16,
    lineHeight: 20,
  },

  helper: {
    marginTop: s(0.5),
    fontSize: 12,
    color: '#666',
  },
  helperError: {
    color: '#d32f2f',
  },
});
